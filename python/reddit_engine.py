import praw
import sys
import os
import re
import time
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
import logging

# Load environment variables explicitly from backend/.env
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path)

# Reddit API Credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

# Initialize Reddit API
reddit = None
if REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET:
    try:
        reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT or "CrowdScope Scraper"
        )
    except Exception as e:
        logging.error(f"Reddit API initialization error: {str(e)}")

def sanitize_subreddit_name(name):
    """Sanitize subreddit name to ensure it's valid format."""
    if name.startswith('r/'):
        name = name[2:]
    name = re.sub(r'[^\w\-]', '', name)
    return name

def process_single_post(post, comment_limit, clean_name):
    """Process a single post, fetching comments with timing instrumentation."""
    post_data = {
        "title": post.title,
        "score": post.score,
        "url": f"https://www.reddit.com{post.permalink}",
        "subreddit": clean_name,
        "body": post.selftext[:1500] if post.selftext else "",
        "comments": []
    }
    
    start_comments = time.time()
    try:
        # Enforce top sorting and prevent deep tree walking
        post.comment_sort = 'top'
        comment_count = 0
        bot_phrases = ["welcome to r/", "please read the rules", "moderator of this subreddit", "action was performed automatically"]
        
        for comment in post.comments:
            if comment_count >= comment_limit:
                break
                
            # Skip MoreComments objects immediately to prevent lazy-loaded network requests
            if isinstance(comment, praw.models.MoreComments):
                continue
                
            if not isinstance(comment, praw.models.Comment):
                continue
            
            # Author Filter
            if comment.author:
                author_name = comment.author.name.lower()
                if author_name == 'automoderator' or author_name.endswith('bot'):
                    continue
            
            # Length Filter
            comment_body = comment.body or ""
            if len(comment_body.split()) < 5:
                continue
                
            # Phrase Filter
            if any(phrase in comment_body.lower() for phrase in bot_phrases):
                continue
                
            post_data["comments"].append(comment_body)
            comment_count += 1
            
    except Exception as e:
        logging.error(f"Error fetching comments for post {post.id}: {str(e)}")
        
    comment_duration = time.time() - start_comments
    # Log comment fetching time to help diagnose Reddit API latency
    if comment_duration > 0.5:
        logging.info(f"[r/{clean_name}] Comments fetched for post '{post.title[:15]}...' in {comment_duration:.3f}s")
    return post_data

def fetch_single_subreddit(subreddit_name, query, post_limit, comment_limit):
    if not reddit:
        return []
        
    clean_name = sanitize_subreddit_name(subreddit_name)
    if not clean_name:
        return []
        
    start_time = time.time()
    posts_data = []
    try:
        subreddit = reddit.subreddit(clean_name)
        
        # Validate subreddit exists and is public/accessible
        try:
            _ = subreddit.id
        except Exception as e:
            logging.error(f"Subreddit r/{clean_name} does not exist or is inaccessible: {str(e)}")
            return []
            
        search_start = time.time()
        
        # Concurrent fetching of different sorts
        raw_posts = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            future_rel = executor.submit(lambda: list(subreddit.search(query, limit=post_limit, sort='relevance')))
            future_top = executor.submit(lambda: list(subreddit.search(query, limit=post_limit, sort='top', time_filter='year')))
            future_new = executor.submit(lambda: list(subreddit.search(query, limit=post_limit, sort='new')))
            
            for future in [future_rel, future_top, future_new]:
                try:
                    raw_posts.extend(future.result())
                except Exception as e:
                    logging.warning(f"Error fetching a sort variant in r/{clean_name}: {e}")

        # Deduplicate
        unique_posts = {}
        for post in raw_posts:
            if post.id not in unique_posts:
                unique_posts[post.id] = post
                
        dedup_posts = list(unique_posts.values())
        
        # Heuristic filtering and scoring
        scored_posts = []
        for post in dedup_posts:
            text_len = len(post.selftext) if post.selftext else 0
            if text_len < 50 and post.num_comments < 2:
                # low effort, throw away
                continue
                
            importance_score = post.score + (post.num_comments * 5)
            scored_posts.append((importance_score, post))
            
        # Sort by importance
        scored_posts.sort(key=lambda x: x[0], reverse=True)
        
        # Take the top `post_limit`
        top_posts = [p[1] for p in scored_posts[:post_limit]]
        
        search_duration = time.time() - search_start
        logging.info(f"[r/{clean_name}] Diversified search returned {len(dedup_posts)} unique valid posts, selected top {len(top_posts)} in {search_duration:.3f}s")
        
        if top_posts:
            # Concurrently fetch all posts within the subreddit (O(1) latency instead of O(posts))
            with ThreadPoolExecutor(max_workers=len(top_posts)) as executor:
                futures = [
                    executor.submit(process_single_post, post, comment_limit, clean_name)
                    for post in top_posts
                ]
                for future in futures:
                    posts_data.append(future.result())
            
    except Exception as e:
        logging.error(f"Error processing subreddit r/{clean_name}: {str(e)}")
        
    duration = time.time() - start_time
    logging.info(f"Finished r/{clean_name} total time: {duration:.3f}s")
    return posts_data

def fetch_fallback_all(query, post_limit, comment_limit):
    if not reddit:
        return []
        
    logging.info(f"No posts found in specified subreddits, trying r/all")
    start_time = time.time()
    posts_data = []
    try:
        all_subreddit = reddit.subreddit("all")
        search_start = time.time()
        
        raw_posts = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            future_rel = executor.submit(lambda: list(all_subreddit.search(query, limit=post_limit * 2, sort='relevance')))
            future_top = executor.submit(lambda: list(all_subreddit.search(query, limit=post_limit * 2, sort='top', time_filter='year')))
            future_new = executor.submit(lambda: list(all_subreddit.search(query, limit=post_limit * 2, sort='new')))
            
            for future in [future_rel, future_top, future_new]:
                try:
                    raw_posts.extend(future.result())
                except Exception as e:
                    pass

        unique_posts = {}
        for post in raw_posts:
            if post.id not in unique_posts:
                unique_posts[post.id] = post
                
        dedup_posts = list(unique_posts.values())
        
        scored_posts = []
        for post in dedup_posts:
            text_len = len(post.selftext) if post.selftext else 0
            if text_len < 50 and post.num_comments < 2:
                continue
            importance_score = post.score + (post.num_comments * 5)
            scored_posts.append((importance_score, post))
            
        scored_posts.sort(key=lambda x: x[0], reverse=True)
        top_posts = [p[1] for p in scored_posts[:post_limit * 2]]
        
        logging.info(f"[r/all] Search returned {len(top_posts)} highly important posts in {time.time() - search_start:.3f}s")
        
        if top_posts:
            with ThreadPoolExecutor(max_workers=min(len(top_posts), 20)) as executor:
                futures = [
                    executor.submit(process_single_post, post, comment_limit, "all")
                    for post in top_posts
                ]
                for future in futures:
                    posts_data.append(future.result())
                    
    except Exception as e:
        logging.error(f"Error with fallback to r/all: {str(e)}")
        
    logging.info(f"Finished r/all total time: {time.time() - start_time:.3f}s")
    return posts_data

def fetch_reddit_posts(subreddits, query, post_limit=8, comment_limit=5):
    if not reddit:
        error_msg = "Reddit API credentials missing in .env file"
        logging.error(error_msg)
        raise Exception(error_msg)
        
    posts_data = []
    try:
        logging.info(f"Using subreddits {subreddits} with query '{query}', post_limit={post_limit}, comment_limit={comment_limit}")
        
        max_workers = len(subreddits) if subreddits else 1
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [
                executor.submit(fetch_single_subreddit, sub_name, query, post_limit, comment_limit)
                for sub_name in subreddits
            ]
            for future in futures:
                posts_data.extend(future.result())
                
        # If no posts were found in any subreddit, try with r/all as fallback
        if not posts_data and "all" not in [s.lower() for s in subreddits]:
            posts_data = fetch_fallback_all(query, post_limit, comment_limit)
            
    except Exception as e:
        logging.error(f"Unexpected error in fetch_reddit_posts: {str(e)}")
        raise e
        
    return posts_data
