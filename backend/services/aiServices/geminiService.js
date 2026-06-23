import axios from "axios";
import { GEMINI_MODEL } from "../../constants/gemini.js";

async function generateContent(prompt) {
    const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/" + GEMINI_MODEL + ":generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: { 
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                }
            }
        );

    return geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
};

export default generateContent;