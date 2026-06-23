import { performMarketAnalysis } from "../services/analysis/marketAnalysisService.js";

export const analyze = async (req, res) => {
    const { industry, query, autoDetect } = req.body;
    
    // 1. Input Validation
    if (!query || (!autoDetect && !industry)) {
        return res.status(400).json({ 
            error: "Query is required, and industry is required when auto-detect is off" 
        });
    }
    
    try {
        // 2. Delegate to the orchestrator service
        const insights = await performMarketAnalysis(industry, query, autoDetect);
        
        // 3. Send HTTP response
        return res.json({ insights });
    } catch (err) {
        console.error("Error in analyze controller:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
