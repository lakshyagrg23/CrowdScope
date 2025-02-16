import praw
import json
import sys
import os
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

def fetch_reddit_posts(subreddits, query):
    posts_data = []
    
    for subreddit_name in subreddits:
        subreddit = reddit.subreddit(subreddit_name)
        posts = subreddit.search(query, limit=5)
        
        for post in posts:
            post_data = {
                "title": post.title,
                "score": post.score,
                "url": post.url,
                "comments": []
            }
            
            post.comments.replace_more(limit=0)
            for comment in post.comments.list()[:5]:
                post_data["comments"].append(comment.body)
            
            posts_data.append(post_data)
    
    return posts_data

if __name__ == "__main__":
    subreddits = json.loads(sys.argv[1])  # Read subreddits list from command-line args
    query = sys.argv[2]
    result = fetch_reddit_posts(subreddits, query)
    print(json.dumps(result))
