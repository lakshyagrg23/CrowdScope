import { generateContent } from "../aiServices/contentGenerationService.js";

/**
 * Generates the community intelligence report from the provided dataset using Gemini.
 * 
 * @param {string} query The original user research query.
 * @param {Object} context The research context containing entity and industry.
 * @param {Object} dataset The structured discussion dataset.
 * @returns {Promise<Object>} The parsed report object.
 */
export const generateReport = async (query, context, dataset) => {
  const prompt = `You are an expert market intelligence and product analyst.
We are conducting research on the query: '${query}'
Primary Entity under research: '${context.entity}'
Industry classification: '${context.industry}'

Analyze the following community discussion dataset related to '${context.entity}' and synthesize a comprehensive research report tailored to the research query: '${query}'.

The output MUST be in valid JSON format. Return ONLY the JSON object, do not wrap it in markdown block quotes (such as \`\`\`json) and do not provide any additional text or formatting before or after the JSON.

Expected JSON Structure:
{
  "summary": "A 1-2 sentence executive summary of the overall community sentiment and key takeaways related to the query.",
  "topics": [
    { 
      "title": "Topic Name", 
      "explanation": "Detailed explanation of what this topic is about.", 
      "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] 
    }
  ],
  "strengths": [
    { 
      "title": "Strength Name", 
      "explanation": "Detailed explanation of what this strength is about.", 
      "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] 
    }
  ],
  "painPoints": [
    { 
      "title": "Pain Point Name", 
      "explanation": "Detailed explanation of what this pain point is about.", 
      "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] 
    }
  ],
  "featureRequests": [
    { 
      "title": "Feature/Consumer Request Name", 
      "explanation": "Detailed explanation of what this feature/consumer request is about.", 
      "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] 
    }
  ],
  "competitors": [
    { 
      "title": "Competitor Name", 
      "explanation": "Detailed explanation of competitor signals, differentiation, or switching mentions.", 
      "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] 
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation Name",
      "recommendation": "Detailed actionable strategic recommendation.",
      "basedOn": [
        "Title of supporting strength/pain point/feature request 1",
        "Title of supporting strength/pain point/feature request 2"
      ],
      "expectedImpact": "Expected business impact of implementing this recommendation."
    }
  ]
}

Guidelines:
1. Do NOT estimate frequencies, invent statistics, or output any quantitative metrics. Do NOT include fields like "mentions" anywhere.
2. Only report findings directly supported by the provided discussion dataset.
3. Every finding in topics, strengths, painPoints, featureRequests, and competitors MUST be qualitative, detailed, and include a descriptive "title", a clear "explanation", and supporting "examples".
4. Every recommendation MUST be directly traceable to the findings, referencing the specific finding titles in the "basedOn" array.
5. In "examples", extract 1-3 distinct, concise, and realistic quotes or paraphrases from the dataset to back up each item.
6. Focus the findings primarily on the research query: '${query}'. If a particular array has no data in the dataset or is irrelevant, return an empty array for that key. Do not omit the key.

Discussion Dataset (JSON format):
${JSON.stringify(dataset, null, 2)}`;

  const geminiText = await generateContent(prompt);
  
  // Clean markdown blocks if the AI still returned them
  let cleanedText = geminiText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error parsing report JSON from Gemini. Raw text:", geminiText, error);
    
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

    // Return safe fallback
    return {
      summary: `Analysis for ${query} could not be fully compiled due to a format error.`,
      topics: [],
      strengths: [],
      painPoints: [],
      featureRequests: [],
      competitors: [],
      recommendations: []
    };
  }
};
