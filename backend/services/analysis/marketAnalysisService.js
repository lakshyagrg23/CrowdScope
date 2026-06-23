import { discoverSubreddits } from "../reddit/subredditDiscoveryService.js";
import { fetchRedditData } from "../reddit/postFetchingService.js";
import { generateBusinessInsights } from "./insightGenerationService.js";

export const performMarketAnalysis = async (industry, query, autoDetect) => {
    // 1. Ask Gemini to discover subreddits
    const subreddits = await discoverSubreddits(industry, query, autoDetect);
    console.log(`[MarketAnalysisService] Discovered subreddits: ${subreddits}`);

    // 2. Spawn Python subprocess to scrape Reddit
    const redditData = await fetchRedditData(subreddits, query);
    console.log(`[MarketAnalysisService] Scraped ${redditData.length} posts`);

    // 3. Feed the scraped posts back to Gemini for final business insights
    const insights = await generateBusinessInsights(query, industry, redditData);

    return insights;
};
