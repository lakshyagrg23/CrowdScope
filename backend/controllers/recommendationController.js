import { getRecommendations } from "../services/analysis/recommendationService.js";

export const recommendProducts = async (req, res) => {
    const { needsDescription, category, priceRange } = req.body;
    
    if (!needsDescription || !category || !priceRange) {
        return res.status(400).json({ error: "Description, category and price range are all required" });
    }
    
    try {
        const result = await getRecommendations(needsDescription, category, priceRange);
        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
