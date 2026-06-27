import axios from 'axios';

const FASTAPI_URL = process.env.SEMANTIC_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Fetches Reddit data by calling the persistent FastAPI ML service.
 * 
 * @param {Array<string>} subreddits The list of subreddits to search.
 * @param {string} query The research query.
 * @param {number} postLimit Max posts per subreddit.
 * @param {number} commentLimit Max comments per post.
 * @returns {Promise<Array>} The fetched posts.
 */
export const fetchRedditData = async (subreddits, query, postLimit, commentLimit) => {
    try {
        const response = await axios.post(`${FASTAPI_URL}/reddit/fetch`, {
            subreddits,
            query,
            post_limit: postLimit || 8,
            comment_limit: commentLimit || 3
        }, {
            timeout: 60000 // Reddit API can still be slow depending on load
        });
        
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Reddit data via FastAPI:", error.message);
        
        if (error.response) {
            console.error("FastAPI Error Response:", error.response.data);
        }
        
        throw error;
    }
};
