import { analyzeProduct } from "../services/analysis/productAnalysisService.js";

export const getProductAnalysis = async (req, res) => {
    const { productName, compareProduct } = req.body;
    
    if (!productName) {
        return res.status(400).json({ error: "Product name is required" });
    }
    
    try {
        const result = await analyzeProduct(productName, compareProduct);
        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
