import { generateContent } from "../aiServices/index.js";

export const generateBusinessInsights = async (query, industry, redditData) => {
    const prompt = `Analyze the following Reddit discussions related to '${query}' in the '${industry}' industry and provide business insights to the product manufacturers/service providers. Structure the output in JSON format with four keys: 'overview', 'positives', 'shortcomings', and 'suggestions'. Data: ${JSON.stringify(redditData)}`;

    const geminiText = await generateContent(prompt);
    let cleanedText = geminiText.replace(/```json|```/g, "").trim();

    try {
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error parsing business insights JSON:", error);
        return {
            overview: "No overview available",
            positives: "No positive insights found",
            shortcomings: "No shortcomings identified",
            suggestions: "No suggestions available"
        };
    }
};
