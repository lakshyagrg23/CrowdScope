const express = require("express");
const axios = require("axios");
const { spawn } = require("child_process");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Route to fetch relevant subreddits and analyze insights
app.post("/analyze", async (req, res) => {
    const { industry, query } = req.body;
    
    if (!industry || !query) {
        return res.status(400).json({ error: "Industry and query are required" });
    }
    
    try {
        // Step 1: Ask Gemini API to determine the best subreddits for this query
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `Given the industry '${industry}' and the query '${query}', suggest relevant Reddit subreddits where discussions on this topic are likely found. Only return subreddit names in a JSON array format.` }]
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

        let subredditsText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Remove markdown formatting if present
        subredditsText = subredditsText.replace(/```json|```/g, " ").trim();
        
        let subreddits;
        try {
            subreddits = JSON.parse(subredditsText);
        } catch (error) {
            console.error("Error parsing subreddits from Gemini:", error);
            subreddits = [];
        }
        
        // If no relevant subreddits are found, use 'all' as fallback
        if (!Array.isArray(subreddits) || subreddits.length === 0) {
            subreddits = ["all"];
        }
        
        console.log(`Using subreddits: ${subreddits}`);
        

        // If no relevant subreddits are found, use 'all' as fallback
        if (!Array.isArray(subreddits) || subreddits.length === 0) {
            subreddits = ["all"];
        }

        console.log(`Using subreddits: ${subreddits}`);

        // Step 2: Call Python script to fetch Reddit data from those subreddits
        const pythonProcess = spawn("python", ["fetch_reddit.py", JSON.stringify(subreddits), query]);
        let redditData = "";

        pythonProcess.stdout.on("data", (data) => {
            redditData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on("close", async (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Error fetching Reddit data" });
            }
            
            try {
                const redditJSON = JSON.parse(redditData);
            
                // Step 3: Process the fetched data using Gemini API for insights
                const geminiInsightsResponse = await axios.post(
                    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
                    {
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: `Analyze the following Reddit discussions related to '${query}' in the '${industry}' industry and provide business insights to the product manufacturers/service providers. Structure the output in JSON format with four keys: 'overview', 'positives', 'shortcomings', and 'suggestions'. Data: ${JSON.stringify(redditJSON)}` }]
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
            
                let insightsText = geminiInsightsResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                insightsText = insightsText.replace(/```json|```/g, "").trim();
                
                let structuredInsights;
                try {
                    structuredInsights = JSON.parse(insightsText);
                } catch (error) {
                    console.error("Error parsing insights from Gemini:", error);
                    structuredInsights = {
                        overview: "No overview available",
                        positives: "No positive insights found",
                        shortcomings: "No shortcomings identified",
                        suggestions: "No suggestions available"
                    };
                }
            
                res.json({ insights: structuredInsights });
            
            } catch (err) {
                console.error("Error processing with Gemini:", err);
                if (!res.headersSent) {
                    return res.status(500).json({ error: "Error processing insights" });
                }
            }
            
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
