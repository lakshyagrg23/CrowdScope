import praw
import json
import sys
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
        print(f"Debug: Reddit API initialization error: {str(e)}", file=sys.stderr)

def sanitize_subreddit_name(name):
    """Sanitize subreddit name to ensure it's valid format."""
    if name.startswith('r/'):
        name = name[2:]
    name = re.sub(r'[^\w\-]', '', name)
    return name

def fetch_single_subreddit(subreddit_name, query, post_limit, comment_limit):
    if not reddit:
        return []
        
    posts_data = []
    clean_name = sanitize_subreddit_name(subreddit_name)
    if not clean_name:
        return []
        
    start_time = time.time()
    try:
        subreddit = reddit.subreddit(clean_name)
        
        # Validate subreddit exists and is public/accessible
        try:
            _ = subreddit.id
        except Exception as e:
            print(f"Debug: Subreddit r/{clean_name} does not exist or is inaccessible: {str(e)}", file=sys.stderr)
            return []
            
        search_start = time.time()
        posts = list(subreddit.search(query, limit=post_limit, sort='relevance'))
        search_duration = time.time() - search_start
        print(f"Debug: [r/{clean_name}] Search for '{query}' returned {len(posts)} posts in {search_duration:.3f}s", file=sys.stderr)
        
        for post in posts:
            post_data = {
                "title": post.title,
                "score": post.score,
                "url": f"https://www.reddit.com{post.permalink}",
                "subreddit": clean_name,
                "body": post.selftext[:1500] if post.selftext else "",
                "comments": []
            }
            
            # Zero-network comment iteration (direct list slicing)
            comment_count = 0
            bot_phrases = ["welcome to r/", "please read the rules", "moderator of this subreddit", "action was performed automatically"]
            
            for comment in post.comments:
                if comment_count >= comment_limit:
                    break
                
                if not isinstance(comment, praw.models.Comment):
                    continue
                
                # 1. Author Filter
                if comment.author:
                    author_name = comment.author.name.lower()
                    if author_name == 'automoderator' or author_name.endswith('bot'):
                        continue
                
                # 2. Length Filter
                comment_body = comment.body or ""
                if len(comment_body.split()) < 5:
                    continue
                    
                # 3. Text/Phrase Substring Filter
                if any(phrase in comment_body.lower() for phrase in bot_phrases):
                    continue
                    
                post_data["comments"].append(comment_body)
                comment_count += 1
                
            posts_data.append(post_data)
            
    except Exception as e:
        print(f"Debug: Error processing subreddit r/{clean_name}: {str(e)}", file=sys.stderr)
        
    duration = time.time() - start_time
    print(f"Debug: Finished r/{clean_name} in {duration:.3f}s", file=sys.stderr)
    return posts_data

def fetch_fallback_all(query, post_limit, comment_limit):
    if not reddit:
        return []
        
    print(f"Debug: No posts found in specified subreddits, trying r/all", file=sys.stderr)
    posts_data = []
    try:
        all_subreddit = reddit.subreddit("all")
        posts = list(all_subreddit.search(query, limit=post_limit * 2, sort='relevance'))
        
        for post in posts:
            post_data = {
                "title": post.title,
                "score": post.score,
                "url": f"https://www.reddit.com{post.permalink}",
                "subreddit": "all",
                "body": post.selftext[:1500] if post.selftext else "",
                "comments": []
            }
            
            comment_count = 0
            bot_phrases = ["welcome to r/", "please read the rules", "moderator of this subreddit", "action was performed automatically"]
            
            for comment in post.comments:
                if comment_count >= comment_limit:
                    break
                if not isinstance(comment, praw.models.Comment):
                    continue
                if comment.author:
                    author_name = comment.author.name.lower()
                    if author_name == 'automoderator' or author_name.endswith('bot'):
                        continue
                comment_body = comment.body or ""
                if len(comment_body.split()) < 5:
                    continue
                if any(phrase in comment_body.lower() for phrase in bot_phrases):
                    continue
                post_data["comments"].append(comment_body)
                comment_count += 1
                
            posts_data.append(post_data)
    except Exception as e:
        print(f"Debug: Error with fallback to r/all: {str(e)}", file=sys.stderr)
    return posts_data

def fetch_reddit_posts(subreddits, query, post_limit=8, comment_limit=5):
    if not reddit:
        print(json.dumps({"error": "Reddit API credentials missing in .env file"}))
        return []
        
    posts_data = []
    try:
        print(f"Debug: Using subreddits {subreddits} with query '{query}', post_limit={post_limit}, comment_limit={comment_limit}", file=sys.stderr)
        
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
        print(f"Debug: Unexpected error in fetch_reddit_posts: {str(e)}", file=sys.stderr)
        
    return posts_data

if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Missing required arguments"}))
            sys.exit(1)
            
        subreddits = json.loads(sys.argv[1])  # Read subreddits list from command-line args
        query = sys.argv[2]
        
        post_limit = 8
        comment_limit = 5
        
        if len(sys.argv) > 3:
            try:
                post_limit = int(sys.argv[3])
            except ValueError:
                pass
        if len(sys.argv) > 4:
            try:
                comment_limit = int(sys.argv[4])
            except ValueError:
                pass
        
        # Handle empty or invalid inputs
        if not subreddits or not isinstance(subreddits, list):
            subreddits = ["all"]
        if not query or not isinstance(query, str):
            print(json.dumps({"error": "Invalid query parameter"}))
            sys.exit(1)
            
        result = fetch_reddit_posts(subreddits, query, post_limit, comment_limit)
        
        # Always return a valid JSON array, even if empty
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Script execution error: {str(e)}"}))
        sys.exit(1)