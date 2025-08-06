import praw
import json
import sys
import os
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Reddit API Credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent=REDDIT_USER_AGENT
)

def sanitize_subreddit_name(name):
    """Sanitize subreddit name to ensure it's valid format."""
    # Remove 'r/' prefix if present
    if name.startswith('r/'):
        name = name[2:]
    
    # Remove any non-alphanumeric characters except underscores and dashes
    name = re.sub(r'[^\w\-]', '', name)
    
    return name


def fetch_reddit_posts(subreddits, query):
    posts_data = []
    
    try:
        # Validate credentials
        if not REDDIT_CLIENT_ID or not REDDIT_CLIENT_SECRET:
            print(json.dumps({"error": "Reddit API credentials missing in .env file"}))
            return []

        # Print info for debugging
        print(f"Debug: Using subreddits {subreddits} with query '{query}'", file=sys.stderr)
        
        # Initialize Reddit API with error handling
        try:
            reddit = praw.Reddit(
                client_id=REDDIT_CLIENT_ID,
                client_secret=REDDIT_CLIENT_SECRET,
                user_agent=REDDIT_USER_AGENT
            )
        except Exception as e:
            print(f"Debug: Reddit API initialization error: {str(e)}", file=sys.stderr)
            return []
            
        for subreddit_name in subreddits:
            # Clean up subreddit name
            clean_name = sanitize_subreddit_name(subreddit_name)
            if not clean_name:
                print(f"Debug: Skipping invalid subreddit name: {subreddit_name}", file=sys.stderr)
                continue
                
            try:
                subreddit = reddit.subreddit(clean_name)
                
                # Use a try-except block for the search
                try:
                    posts = subreddit.search(query, limit=5, sort='relevance')
                    
                    post_count = 0
                    for post in posts:
                        post_data = {
                            "title": post.title,
                            "score": post.score,
                            "url": f"https://www.reddit.com{post.permalink}",
                            "subreddit": clean_name,
                            "comments": []
                        }
                        
                        # Handle comments safely
                        try:
                            post.comments.replace_more(limit=0)
                            for comment in post.comments.list()[:5]:
                                post_data["comments"].append(comment.body)
                        except Exception as e:
                            print(f"Debug: Error fetching comments for post: {str(e)}", file=sys.stderr)
                        
                        posts_data.append(post_data)
                        post_count += 1
                        
                    print(f"Debug: Found {post_count} posts in r/{clean_name}", file=sys.stderr)
                    
                except Exception as e:
                    print(f"Debug: Error searching subreddit r/{clean_name}: {str(e)}", file=sys.stderr)
                    
            except Exception as e:
                print(f"Debug: Error accessing subreddit r/{clean_name}: {str(e)}", file=sys.stderr)
                
        # If no posts were found in any subreddit, try with r/all as fallback
        if not posts_data and "all" not in [s.lower() for s in subreddits]:
            print(f"Debug: No posts found in specified subreddits, trying r/all", file=sys.stderr)
            try:
                all_subreddit = reddit.subreddit("all")
                posts = all_subreddit.search(query, limit=10, sort='relevance')
                
                for post in posts:
                    post_data = {
                        "title": post.title,
                        "score": post.score,
                        "url": f"https://www.reddit.com{post.permalink}",
                        "subreddit": "all",
                        "comments": []
                    }
                    
                    try:
                        post.comments.replace_more(limit=0)
                        for comment in post.comments.list()[:5]:
                            post_data["comments"].append(comment.body)
                    except Exception as e:
                        pass
                    
                    posts_data.append(post_data)
            except Exception as e:
                print(f"Debug: Error with fallback to r/all: {str(e)}", file=sys.stderr)
    
    except Exception as e:
        print(f"Debug: Unexpected error in fetch_reddit_posts: {str(e)}", file=sys.stderr)
    
    return posts_data

# def fetch_reddit_posts(subreddits, query):
#     posts_data = []
    
#     for subreddit_name in subreddits:
#         subreddit = reddit.subreddit(subreddit_name)
#         posts = subreddit.search(query, limit=5)
        
#         for post in posts:
#             post_data = {
#                 "title": post.title,
#                 "score": post.score,
#                 "url": post.url,
#                 "comments": []
#             }
            
#             post.comments.replace_more(limit=0)
#             for comment in post.comments.list()[:5]:
#                 post_data["comments"].append(comment.body)
            
#             posts_data.append(post_data)
    
#     return posts_data

if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Missing required arguments"}))
            sys.exit(1)
            
        subreddits = json.loads(sys.argv[1])  # Read subreddits list from command-line args
        query = sys.argv[2]
        
        # Handle empty or invalid inputs
        if not subreddits or not isinstance(subreddits, list):
            subreddits = ["all"]
        if not query or not isinstance(query, str):
            print(json.dumps({"error": "Invalid query parameter"}))
            sys.exit(1)
            
        result = fetch_reddit_posts(subreddits, query)
        
        # Always return a valid JSON array, even if empty
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Script execution error: {str(e)}"}))
        sys.exit(1)
