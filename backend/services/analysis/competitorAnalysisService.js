import { generateContent } from "../aiServices/index.js";
import { discoverSubreddits } from "../reddit/subredditDiscoveryService.js";
import { fetchRedditData } from "../reddit/postFetchingService.js";

export const analyzeCompetitor = async (industry, product, competitor, autoDetect) => {
    // Step 1: Discover Subreddits
    const queryContext = `the product '${product}' and its competitor '${competitor}'`;
    const subreddits = await discoverSubreddits(industry, queryContext, autoDetect);
    
    // Step 2: Fetch Reddit Data
    const searchQuery = `${product} OR ${competitor}`;
    const redditData = await fetchRedditData(subreddits, searchQuery);
    
    // Step 3: Generate Competitor Analysis using Gemini
    const analysisPrompt = autoDetect ?
        `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}'. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}. 
        
        Structure the output in JSON format with the following keys:
        - 'overview' (general comparison)
        - 'strengths' (competitor's strengths)
        - 'weaknesses' (competitor's weaknesses)
        - 'perception' (how users perceive the competitor in the market)
        - 'recommendations' (strategic insights for ${product} based on competitor analysis)
        - 'comparisonTable' (an array of objects, each with 'feature', 'yourProduct', and 'competitor' properties, comparing at least 5 key features, metrics, or aspects)
        
        Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditData)}` :
        
        `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}' in the '${industry}' industry. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}.
        
        Structure the output in JSON format with the following keys:
        - 'overview' (general comparison)
        - 'strengths' (competitor's strengths)
        - 'weaknesses' (competitor's weaknesses)
        - 'perception' (how users perceive the competitor in the market)
        - 'recommendations' (strategic insights for ${product} based on competitor analysis)
        - 'comparisonTable' (an array of objects, each with 'feature', 'yourProduct', and 'competitor' properties, comparing at least 5 key features, metrics, or aspects)
        
        Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditData)}`;
        
    let analysisText = await generateContent(analysisPrompt);
    
    // Improved JSON extraction
    const firstBrace = analysisText.indexOf('{');
    const lastBrace = analysisText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        analysisText = analysisText.substring(firstBrace, lastBrace + 1);
    }
    
    analysisText = analysisText.replace(/```json|```/g, "").trim();
    
    let structuredAnalysis;
    try {
        structuredAnalysis = JSON.parse(analysisText);
    } catch (error) {
        console.error("Error parsing competitor analysis from Gemini:", error);
        structuredAnalysis = { error: "Failed to parse analysis" };
    }

    return structuredAnalysis;
};
