import competitorService from "../services/analysis/competitorService.js"

export const findCompetitors = async (req, res) => {
    const { industry, product, autoDetect } = req.body;
    
    if (!product) {
        return res.status(400).json({ error: "Product name is required" });
    }
    
    try {
        const competitors = await competitorService(industry, product, autoDetect);
        return res.json({ competitors });
    } catch (err) {
        console.error("Error in competitor controller:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};