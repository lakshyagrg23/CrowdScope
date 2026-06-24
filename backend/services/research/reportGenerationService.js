import { generateContent } from "../aiServices/contentGenerationService.js";

/**
 * Generates the community intelligence report from the provided corpus using Gemini.
 * 
 * @param {string} query The original user research query.
 * @param {Object} context The research context containing entity and industry.
 * @param {string} corpus The formatted discussions text corpus.
 * @returns {Promise<Object>} The parsed report object.
 */
export const generateReport = async (query, context, corpus) => {
  const prompt = `You are an expert market intelligence and product analyst.
We are conducting research on the query: '${query}'
Primary Entity under research: '${context.entity}'
Industry classification: '${context.industry}'

Analyze the following community discussion corpus related to '${context.entity}' and synthesize a comprehensive research report tailored to the research query: '${query}'.

The output MUST be in valid JSON format. Return ONLY the JSON object, do not wrap it in markdown block quotes (such as \`\`\`json) and do not provide any additional text or formatting before or after the JSON.

Expected JSON Structure:
{
  "summary": "A 1-2 sentence executive summary of the overall community sentiment and key takeaways related to the query.",
  "topics": [
    { "title": "Topic Name", "mentions": 10, "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] }
  ],
  "strengths": [
    { "title": "Strength Name", "mentions": 8, "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] }
  ],
  "painPoints": [
    { "title": "Pain Point Name", "mentions": 12, "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] }
  ],
  "featureRequests": [
    { "title": "Feature Request Name", "mentions": 15, "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] }
  ],
  "competitors": [
    { "title": "Competitor Name", "mentions": 5, "examples": ["Example quote or paraphrase 1", "Example quote or paraphrase 2"] }
  ]
}

Guidelines:
1. Make sure to aggregate similar concerns/feedback into meaningful groupings with descriptive titles.
2. In 'mentions', estimate the number of times this topic/point was mentioned or implied based on the discussions, or assign a representative magnitude relative to the corpus.
3. In 'examples', extract 1-3 distinct, concise, and realistic quotes or paraphrases from the corpus to back up each item.
4. Focus the findings primarily on the research query: '${query}'. If a particular array (e.g. competitors or feature requests) has no data in the corpus or is irrelevant, return an empty array for that key. Do not omit the key.

Discussion Corpus:
${corpus}`;

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
      competitors: []
    };
  }
};
