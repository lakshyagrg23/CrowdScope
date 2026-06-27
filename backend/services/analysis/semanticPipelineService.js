import axios from 'axios';

const FASTAPI_URL = process.env.SEMANTIC_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Executes the Python semantic pipeline by calling the FastAPI ML service.
 * 
 * @param {Object} dataset The structured dataset with discussions.
 * @returns {Promise<Object>} The dataset enriched with semantic clusters.
 */
export const runSemanticPipeline = async (dataset) => {
    try {
        console.time("Semantic Pipeline Execution");
        
        // Make a POST request to the persistent FastAPI ML server
        const response = await axios.post(`${FASTAPI_URL}/semantic`, {
            dataset: dataset,
            mmr_lambda: 0.6,
            mmr_top_k: 3
        }, {
            // Increase timeout for potentially heavy ML inference if dataset is massive
            timeout: 60000 
        });
        
        console.timeEnd("Semantic Pipeline Execution");
        return response.data;
    } catch (error) {
        console.error("Failed to execute semantic pipeline:", error.message);
        
        // Log more details if it's an Axios error from the Python backend
        if (error.response) {
            console.error("FastAPI Error Response:", error.response.data);
        }
        
        throw error;
    }
};
