import { generateContent } from "../aiServices/index.js";
import { discoverSubreddits } from "../reddit/subredditDiscoveryService.js";
import { fetchRedditData } from "../reddit/postFetchingService.js";

export const analyzeProduct = async (productName, compareProduct) => {
    // Step 1: Discover Subreddits
    const queryContext = compareProduct 
        ? `'${productName}' and '${compareProduct}'`
        : `'${productName}'`;
        
    // We pass null for industry since this route doesn't use it, and false for autoDetect to use the generic query prompt
    const subreddits = await discoverSubreddits(null, queryContext, false);
    
    // Step 2: Fetch Reddit Data
    const searchQuery = compareProduct 
        ? `${productName} OR ${compareProduct}`
        : productName;
        
    const redditData = await fetchRedditData(subreddits, searchQuery);
    
    // Step 3: Generate Consumer Product Analysis
    const analysisPrompt = compareProduct 
        ? `Analyze the following Reddit discussions related to '${productName}' and '${compareProduct}'. You are a helpful shopping assistant for consumers. 
        
        Create a comprehensive comparative analysis of these products to help a shopper make an informed decision.
        
        Structure the output in JSON format with the following keys:
        1. "overview" - A brief introduction to both products and their main use cases
        2. "productAnalysis" - Details about ${productName}, including:
           - "pros" - List of strengths
           - "cons" - List of weaknesses
           - "valueRating" - A score from 1-10 on value for money
           - "idealFor" - Type of users this product is best suited for
        3. "competitorAnalysis" - Details about ${compareProduct}, including the same sub-fields as above
        4. "comparisonTable" - An array of objects comparing key features, each with:
           - "feature" - Name of the feature being compared
           - "product1" - How ${productName} performs
           - "product2" - How ${compareProduct} performs
        5. "verdict" - Which product is better overall and in which specific scenarios one might be preferable over the other
        
        Use the actual discussions for information rather than general knowledge about these products.
        
        Data: ${JSON.stringify(redditData)}`
        
        : `Analyze the following Reddit discussions related to '${productName}'. You are a helpful shopping assistant for consumers.
        
        Create a comprehensive product analysis to help a shopper decide whether this is a good purchase.
        
        Structure the output in JSON format with the following keys:
        1. "overview" - A brief introduction to the product and its main use cases
        2. "pros" - List of product strengths and benefits
        3. "cons" - List of product weaknesses and drawbacks
        4. "valueForMoney" - Assessment of whether the product is worth its price
        5. "valueRating" - A numerical score from 1-10
        6. "alternatives" - List of suggested alternative products that shoppers might consider
        7. "idealFor" - Type of users this product is best suited for
        8. "verdict" - Final recommendation on whether to buy this product
        
        Use the actual discussions for information rather than general knowledge about this product.
        
        Data: ${JSON.stringify(redditData)}`;

    let analysisText = await generateContent(analysisPrompt);
    
    // Clean JSON
    const firstBrace = analysisText.indexOf('{');
    const lastBrace = analysisText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        analysisText = analysisText.substring(firstBrace, lastBrace + 1);
    }
    
    analysisText = analysisText.replace(/```json|```/g, "").trim();
    
    let productAnalysis;
    try {
        productAnalysis = JSON.parse(analysisText);
    } catch (error) {
        console.error("Error parsing product analysis from Gemini:", error);
        productAnalysis = { error: "Failed to parse analysis" };
    }

    return { productName, compareProduct: compareProduct || null, analysis: productAnalysis };
};
