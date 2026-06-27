from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
from typing import Dict, Any, List

from semantic_engine import process_dataset
from reddit_engine import fetch_reddit_posts

app = FastAPI(title="CrowdScope Semantic ML Service")

class SemanticRequest(BaseModel):
    dataset: Dict[str, Any]
    mmr_lambda: float = 0.6
    mmr_top_k: int = 3

class RedditFetchRequest(BaseModel):
    subreddits: List[str]
    query: str
    post_limit: int = 8
    comment_limit: int = 5

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": True}

@app.post("/semantic")
def semantic(req: SemanticRequest):
    try:
        logging.info("Received request to process dataset.")
        result = process_dataset(
            req.dataset,
            req.mmr_lambda,
            req.mmr_top_k
        )
        return result
    except Exception as e:
        logging.error(f"Error processing dataset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reddit/fetch")
def fetch_reddit(req: RedditFetchRequest):
    try:
        logging.info(f"Received request to fetch Reddit posts for query: '{req.query}'")
        result = fetch_reddit_posts(
            req.subreddits,
            req.query,
            req.post_limit,
            req.comment_limit
        )
        return result
    except Exception as e:
        logging.error(f"Error fetching Reddit posts: {e}")
        raise HTTPException(status_code=500, detail=str(e))
