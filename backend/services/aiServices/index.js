import generateContentFromGemini from "./geminiService.js";
// import generateContentFromOpenAI from "./openaiService.js"; // You'd create this later!

const ACTIVE_PROVIDER = process.env.AI_PROVIDER || "gemini";

export const generateContent = async (prompt) => {
    switch (ACTIVE_PROVIDER) {
        case "openai":
            // return await generateContentFromOpenAI(prompt);
            throw new Error("OpenAI service not yet implemented");
        case "gemini":
        default:
            return await generateContentFromGemini(prompt);
    }
};
