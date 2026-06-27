import { generateContent } from "../aiServices/contentGenerationService.js";

/**
 * Generates the community intelligence report from structured cluster summaries using Gemini.
 * 
 * @param {string} query The original user research query.
 * @param {Object} context The research context containing entity and industry.
 * @param {Array} clusterSummaries The array of structured business intelligence summaries per cluster.
 * @param {number} attempt The current retry attempt number.
 * @returns {Promise<Object>} The parsed report object.
 */
export const generateReport = async (query, context, clusterSummaries, attempt = 1) => {
  const prompt = `You are an expert Chief Strategy Officer.
We are conducting research on the query: '${query}'
Primary Entity under research: '${context.entity}'
Industry classification: '${context.industry}'

I am providing you with structured Business Intelligence extracted from clustered community discussions.
Each cluster summary represents a distinct topic or sentiment pattern within the community, complete with a mathematically derived confidence score.

Your task is to synthesize these cluster summaries into a cohesive, high-level Executive Report.

The output MUST be in valid JSON format. Return ONLY the JSON object, do not wrap it in markdown block quotes (such as \`\`\`json) and do not provide any additional text or formatting before or after the JSON.

Expected JSON Structure:
{
  "summary": "A 2-3 sentence executive summary of the overall landscape and key takeaways.",
  "discussionLandscape": [
    {
      "title": "High-level theme synthesized from cluster topics",
      "explanation": "Explanation of this theme and its importance",
      "confidence": "High/Medium/Low (based on the provided confidence scores of the clusters that formed this theme)"
    }
  ],
  "strengths": [
    { 
      "title": "Strength Name", 
      "explanation": "Detailed explanation of what this strength is about.", 
      "examples": ["Example quote from evidence"],
      "sourceClusters": [0, 1] 
    }
  ],
  "painPoints": [
    { 
      "title": "Pain Point Name", 
      "explanation": "Detailed explanation of what this pain point is about.", 
      "examples": ["Example quote from evidence"],
      "sourceClusters": [0, 1] 
    }
  ],
  "featureRequests": [
    { 
      "title": "Feature/Consumer Request Name", 
      "explanation": "Detailed explanation.", 
      "examples": ["Example quote from evidence"],
      "sourceClusters": [0, 1] 
    }
  ],
  "competitors": [
    { 
      "title": "Competitor Name", 
      "explanation": "Detailed explanation of competitor signals.", 
      "examples": ["Example quote from evidence"],
      "sourceClusters": [0, 1] 
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation Name",
      "recommendation": "Detailed actionable strategic recommendation.",
      "basedOn": [
        "Title of supporting strength/pain point/feature request"
      ],
      "expectedImpact": "Expected business impact of implementing this recommendation.",
      "sourceClusters": [0, 1]
    }
  ],
  "risks": [
    {
      "title": "Risk Name",
      "explanation": "Detailed explanation of a potential business risk or threat.",
      "sourceClusters": [0, 1]
    }
  ],
  "opportunities": [
    {
      "title": "Opportunity Name",
      "explanation": "Detailed explanation of a potential strategic or market opportunity.",
      "sourceClusters": [0, 1]
    }
  ]
}

Guidelines:
1. Do NOT hallucinate data. Only synthesize from the positiveSignals, negativeSignals, customerRequests, competitors, and evidence provided in the cluster summaries.
2. Consolidate overlapping signals from different clusters into cohesive points.
3. If a section has no relevant signals across all clusters, return an empty array for that key. Do not omit the key.
4. Base the "confidence" in the discussionLandscape on the mathematical confidence scores provided in the clusters (e.g., scores > 0.8 are High, 0.4-0.8 are Medium, < 0.4 are Low).
5. Extract 1-3 distinct, concise quotes from the cluster evidence to back up each finding in strengths, painPoints, featureRequests, and competitors.
6. Every value inside basedOn MUST exactly match the title of an existing finding from strengths, painPoints or featureRequests. Never invent placeholder values.
7. For every item (except summary and discussionLandscape), you MUST provide a "sourceClusters" array containing the integer 'clusterId' values (e.g., [0], [1, 3]) of the clusters that informed the insight.

Structured Cluster Summaries (Business Intelligence):
${JSON.stringify(clusterSummaries, null, 2)}`;

  const geminiText = await generateContent(prompt);
  
  // Clean markdown blocks if the AI still returned them
  let cleanedText = geminiText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error(`Error parsing report JSON from Gemini (Attempt ${attempt}). Raw text length: ${geminiText.length}`);
    
    // Attempt cleanup if it has leading/trailing characters
    try {
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleanedText);
      }
    } catch (nestedError) {
      console.error("Nested parsing cleanup failed:", nestedError);
    }

    // Trigger one automatic retry if parsing completely failed
    if (attempt === 1) {
      console.log("Triggering automatic retry for Executive Report Synthesis due to JSON parsing failure...");
      return generateReport(query, context, clusterSummaries, 2);
    }

    // Return safe fallback if retry also fails
    return {
      summary: `Analysis for ${query} could not be fully compiled due to a format error.`,
      discussionLandscape: [],
      strengths: [],
      painPoints: [],
      featureRequests: [],
      competitors: [],
      recommendations: [],
      risks: [],
      opportunities: []
    };
  }
};
