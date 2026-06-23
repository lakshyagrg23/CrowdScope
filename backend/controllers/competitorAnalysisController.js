import { analyzeCompetitor } from "../services/analysis/competitorAnalysisService.js";

export const getCompetitorAnalysis = async (req, res) => {
    const { industry, product, competitor, autoDetect } = req.body;
    
    if (!product || !competitor) {
        return res.status(400).json({ error: "Both product and competitor are required" });
    }
    
    try {
        const analysis = await analyzeCompetitor(industry, product, competitor, autoDetect);
        res.json({ analysis });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
