import { generateContent } from "../aiServices/index.js";
import { discoverSubreddits } from "../reddit/subredditDiscoveryService.js";
import { fetchRedditData } from "../reddit/postFetchingService.js";

export const getRecommendations = async (needsDescription, category, priceRange) => {
    // Step 1: Discover Subreddits
    // By passing 'true' as the 3rd argument, it uses a generic query format, ignoring industry
    const subreddits = await discoverSubreddits(null, category, true);
    
    // Step 2: Fetch Reddit Data based on category
    const redditData = await fetchRedditData(subreddits, category);
    
    // Step 3: Generate Recommendations
    const recommendationsPrompt = `
        Act as a product recommendation assistant for a shopper. Based on the following user needs:
        
        "${needsDescription}"
        
        And considering they want products in the category "${category}" with a price range of "${priceRange}",
        analyze the discussions and recommend 5 specific products that best match their requirements.
        
        Structure the output in JSON format with the following keys:
        1. "recommendationSummary" - Brief explanation of the recommendation approach and considerations
        2. "recommendedProducts" - Array of exactly 5 products, each with:
           - "name" - Product name
           - "keyFeatures" - Array of 3-5 main features relevant to the user's needs
           - "whyRecommended" - Why this product specifically matches the user's requirements
           - "estimatedPrice" - Approximate price or price range
           - "bestFor" - Specific use case this product is best suited for
        3. "additionalConsiderations" - Other factors the user should consider when making their decision
        
        Use actual product information from the provided Reddit discussions. If specific products aren't mentioned enough,
        recommend real products in this category that match the requirements.
        
        Data: ${JSON.stringify(redditData)}
    `;

    let recommendationsText = await generateContent(recommendationsPrompt);
    
    // Clean JSON
    const firstBrace = recommendationsText.indexOf('{');
    const lastBrace = recommendationsText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        recommendationsText = recommendationsText.substring(firstBrace, lastBrace + 1);
    }
    
    recommendationsText = recommendationsText.replace(/```json|```/g, "").trim();
    
    let recommendations;
    try {
        recommendations = JSON.parse(recommendationsText);
    } catch (error) {
        console.error("Error parsing recommendations from Gemini:", error);
        recommendations = {
            recommendationSummary: "Unable to generate recommendations based on the provided information.",
            recommendedProducts: [],
            additionalConsiderations: "Please try providing more specific requirements."
        };
    }

    return {
        userRequirements: { needsDescription, category, priceRange },
        recommendations
    };
};
