import { generateContent } from "../aiServices/contentGenerationService.js";

/**
 * Prepares the research context by extracting the primary entity, industry, and discovering relevant subreddits.
 * 
 * @param {string} query The user query (e.g. "Notion pricing").
 * @param {number} limit The number of subreddits to return.
 * @returns {Promise<Object>} Object containing entity, industry, and subreddits list.
 */
export const prepareResearchContext = async (query, limit = 4) => {
    const prompt = `Given the user research query '${query}', analyze it and identify:
1. The primary entity/product/brand/subject being researched (e.g. if query is "Notion pricing", the entity is "Notion").
2. The industry it belongs to (e.g. "Productivity Software").
3. Exactly ${limit} relevant Reddit subreddits where discussions about this entity or industry are likely found.

Return ONLY a clean JSON object conforming to this schema. Do not wrap it in markdown code blocks like \`\`\`json.
{
  "entity": "Primary entity",
  "industry": "Industry name",
  "subreddits": ["sub1", "sub2", ...]
}
`;

    const geminiText = await generateContent(prompt);
    
    // Clean markdown blocks
    let cleanedText = geminiText.replace(/```json|```/g, " ").trim();
    
    try {
        const context = JSON.parse(cleanedText);
        if (context.entity && context.subreddits && Array.isArray(context.subreddits)) {
            return context;
        }
        throw new Error("Invalid schema returned by Gemini");
    } catch (error) {
        console.error("Error parsing research context JSON from Gemini:", error);
        // Fallback
        return {
            entity: query,
            industry: "General",
            subreddits: ["all"]
        };
    }
};

/**
 * Legacy wrapper for backward compatibility.
 */
export const discoverSubreddits = async (queryOrIndustry, queryOrLimit, autoDetectOrUndefined) => {
    const limit = typeof queryOrLimit === 'number' ? queryOrLimit : 4;
    const query = typeof queryOrLimit === 'string' ? queryOrLimit : queryOrIndustry;
    const context = await prepareResearchContext(query, limit);
    return context.subreddits;
};
