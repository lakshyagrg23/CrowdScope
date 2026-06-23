import { generateContent } from "../aiServices/index.js";

async function competitorService(industry, product, autoDetect){
    let prompt = autoDetect ? 
        `Based on the product '${product}', identify 5 main competitors in its market space. Only return competitor names in a JSON array format. No additional text.` :
        `Based on the product '${product}' in the '${industry}' industry, identify 5 main competitors in its market space. Only return competitor names in a JSON array format. No additional text.`;

    let competitorsText = await generateContent(prompt);

    // Clean up the response - remove markdown formatting
    competitorsText = competitorsText.replace(/```json|```/g, "").trim();

    // Extract JSON - find the first [ and the last ]
    const firstBracket = competitorsText.indexOf('[');
    const lastBracket = competitorsText.lastIndexOf(']');

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        competitorsText = competitorsText.substring(firstBracket, lastBracket + 1);
    }

    let competitors;
    try {
        competitors = JSON.parse(competitorsText);
    } catch (error) {
        console.error("Error parsing competitors from Gemini:", error);
        console.error("Raw text causing error:", competitorsText);
        competitors = [];
    }

    // If no competitors found, return empty array
    if (!Array.isArray(competitors) || competitors.length === 0) {
        competitors = [];
    }

    return competitors;
}

export default competitorService;