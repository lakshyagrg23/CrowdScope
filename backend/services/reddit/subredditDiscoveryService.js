import { generateContent } from "../aiServices/index.js";

/**
 * Predicts the most relevant subreddits for a query using Gemini.
 */
export const discoverSubreddits = async (industry, query, autoDetect) => {
    const prompt = autoDetect ? 
        `Given the query '${query}', suggest relevant Reddit subreddits where discussions on this topic are likely found. Only return 2 subreddit names in a JSON array format.` :
        `Given the industry '${industry}' and the query '${query}', suggest relevant Reddit subreddits where discussions on this topic are likely found. Only return 2 subreddit names in a JSON array format.`;

    const geminiText = await generateContent(prompt);
    
    // Clean markdown blocks
    let cleanedText = geminiText.replace(/```json|```/g, " ").trim();
    
    try {
        const subreddits = JSON.parse(cleanedText);
        return Array.isArray(subreddits) && subreddits.length > 0 ? subreddits : ["all"];
    } catch (error) {
        console.error("Error parsing subreddits JSON from Gemini:", error);
        return ["all"]; // Safe fallback
    }
};
