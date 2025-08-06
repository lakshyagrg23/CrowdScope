import express from "express";
import axios from "axios";
import { spawn } from "child_process";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import session from "express-session";

const { Pool } = pg;

dotenv.config();
const db = new Pool();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for cookies
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
  app.use(express.json());

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // Only use secure in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration for Google OAuth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await db.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);
                if (user.rows.length) {
                    return done(null, user.rows[0]);
                }

                const newUser = await db.query(
                    "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *",
                    [profile.id, profile.displayName, profile.emails[0].value]
                );
                return done(null, newUser.rows[0]);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Serialize/deserialize user for session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        done(null, user.rows[0]);
    } catch (err) {
        done(err, null);
    }
});


// local strategy for email/password authentication

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
                if (!user.rows.length) {
                    return done(null, false, { message: "No user found" });
                }

                const isMatch = await bcrypt.compare(password, user.rows[0].password);
                if (!isMatch) {
                    return done(null, false, { message: "Incorrect password" });
                }

                return done(null, user.rows[0]);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Authentication required" });
};


// Signup route
app.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    try {
        // Check if user already exists
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length) {
            return res.status(400).json({ error: "Email already in use" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
            [email, hashedPassword, name]
        );
        
        // Automatically log the user in after signup
        req.login(newUser.rows[0], (err) => {
            if (err) {
                return res.status(500).json({ error: "Login after signup failed" });
            }
            return res.json({ user: newUser.rows[0], message: "Signup successful" });
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// Login route using passport local strategy
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: "Server error during authentication" });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || "Authentication failed" });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ error: "Failed to establish session" });
            }
            // Send back user info without sensitive data
            const { password, ...userData } = user;
            return res.json({ 
                user: userData,
                message: "Login successful" 
            });
        });
    })(req, res, next);
});

// Google OAuth routes
// Replace the existing Google OAuth routes with this
app.post("/auth/google", async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }
        
        // Verify the token with Google
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
        );
        
        const { sub, email, name } = response.data;
        
        // Check if user exists in database
        let user = await db.query("SELECT * FROM users WHERE google_id = $1", [sub]);
        
        if (!user.rows.length) {
            // Create new user if not exists
            user = await db.query(
                "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
                [sub, email, name]
            );
        } else {
            user = { rows: [user.rows[0]] };
        }
        
        // Log the user in
        req.login(user.rows[0], (err) => {
            if (err) {
                return res.status(500).json({ error: "Login failed" });
            }
            
            // Return user data without sensitive fields
            const { password, google_id, ...userData } = user.rows[0];
            return res.json({ 
                user: userData,
                message: "Google login successful"
            });
        });
        
    } catch (err) {
        console.error("Google auth error:", err.response?.data || err.message);
        return res.status(401).json({ error: "Invalid Google token" });
    }
});

// Get current authenticated user
app.get("/user", isAuthenticated, (req, res) => {
    // Remove sensitive data
    const { password, google_id, ...userData } = req.user;
    res.json(userData);
});

// Logout route
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        req.session.destroy(); // Destroy session data
        res.clearCookie("connect.sid"); // Clear session cookie
        res.json({ message: "Logged out successfully" });
    });
});



// Route to fetch relevant subreddits and analyze insights
app.post("/analyze", async (req, res) => {
    const { industry, query, autoDetect } = req.body;
    
    if (!query || (!autoDetect && !industry)) {
        return res.status(400).json({ error: "Query is required, and industry is required when auto-detect is off" });
    }
    
    try {
        // Step 1: Ask Gemini API to determine the best subreddits for this query
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: autoDetect ? 
                            `Given the query '${query}', suggest relevant Reddit subreddits where discussions on this topic are likely found. Only return 2 subreddit names in a JSON array format.` :
                            `Given the industry '${industry}' and the query '${query}', suggest relevant Reddit subreddits where discussions on this topic are likely found. Only return 2 subreddit names in a JSON array format.` 
                        }]
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
                    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
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


// Route to find competitors for a given product
app.post("/find-competitors", async (req, res) => {
    const { industry, product, autoDetect } = req.body;
    
    if (!product) {
        return res.status(400).json({ error: "Product name is required" });
    }
    
    try {
        // Ask Gemini API to identify competitors
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: autoDetect ? 
                            `Based on the product '${product}', identify 5 main competitors in its market space. Only return competitor names in a JSON array format. No additional text.` :
                            `Based on the product '${product}' in the '${industry}' industry, identify 5 main competitors in its market space. Only return competitor names in a JSON array format. No additional text.` 
                        }]
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

        let competitorsText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Clean up the response - remove markdown formatting
        competitorsText = competitorsText.replace(/```json|```/g, "").trim();
        
        // Extract JSON - find the first [ and the last ]
        const firstBracket = competitorsText.indexOf('[');
        const lastBracket = competitorsText.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            competitorsText = competitorsText.substring(firstBracket, lastBracket + 1);
        }
        
        let competitors;
        try {
            competitors = JSON.parse(competitorsText);
        } catch (error) {
            console.error("Error parsing competitors from Gemini:", error);
            console.error("Raw text causing error:", competitorsText);
            competitors = [];
        }
        
        // If no competitors found, return empty array
        if (!Array.isArray(competitors) || competitors.length === 0) {
            competitors = [];
        }
        
        res.json({ competitors });
        
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to analyze a specific competitor against the user's product
app.post("/competitor-analysis", async (req, res) => {
    const { industry, product, competitor, autoDetect } = req.body;
    
    if (!product || !competitor) {
        return res.status(400).json({ error: "Both product and competitor are required" });
    }
    
    try {
        // Step 1: Ask Gemini API to determine the best subreddits for both product and competitor
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: autoDetect ? 
                            `Given the product '${product}' and its competitor '${competitor}', suggest relevant Reddit subreddits where discussions comparing these or discussing either of them would be found. Only return 2 subreddit names in a JSON array format.` :
                            `Given the product '${product}' and its competitor '${competitor}' in the '${industry}' industry, suggest relevant Reddit subreddits where discussions comparing these or discussing either of them would be found. Only return 2 subreddit names in a JSON array format.` 
                        }]
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
        subredditsText = subredditsText.replace(/```json|```/g, "").trim();
        
        // Extract JSON array
        const firstBracket = subredditsText.indexOf('[');
        const lastBracket = subredditsText.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            subredditsText = subredditsText.substring(firstBracket, lastBracket + 1);
        }
        
        let subreddits;
        try {
            subreddits = JSON.parse(subredditsText);
        } catch (error) {
            console.error("Error parsing subreddits from Gemini:", error);
            console.error("Raw text causing error:", subredditsText);
            subreddits = ["all"];
        }
        
        if (!Array.isArray(subreddits) || subreddits.length === 0) {
            subreddits = ["all"];
        }
        
        console.log(`Using subreddits for competitor analysis: ${subreddits}`);

        // Step 2: Use Python script to fetch Reddit data for both products
        const pythonProcess = spawn("python", [
            "fetch_reddit.py", 
            JSON.stringify(subreddits), 
            `${product} OR ${competitor}` // Search for posts mentioning either product or competitor
        ]);
        
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
                
                //Previous Prompt
                // `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}'. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}. Structure the output in JSON format with five keys: 'overview' (general comparison), 'strengths' (competitor's strengths), 'weaknesses' (competitor's weaknesses), 'perception' (how users perceive the competitor in the market), and 'recommendations' (strategic insights for ${product} based on competitor analysis). Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditJSON)}` :
                //     `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}' in the '${industry}' industry. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}. Structure the output in JSON format with five keys: 'overview' (general comparison), 'strengths' (competitor's strengths), 'weaknesses' (competitor's weaknesses), 'perception' (how users perceive the competitor in the market), and 'recommendations' (strategic insights for ${product} based on competitor analysis). Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditJSON)}`;

                // Step 3: Generate competitor analysis using Gemini API
                const analysisPrompt = autoDetect ?
                    `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}'. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}. 
                    
                    Structure the output in JSON format with the following keys:
                    - 'overview' (general comparison)
                    - 'strengths' (competitor's strengths)
                    - 'weaknesses' (competitor's weaknesses)
                    - 'perception' (how users perceive the competitor in the market)
                    - 'recommendations' (strategic insights for ${product} based on competitor analysis)
                    - 'comparisonTable' (an array of objects, each with 'feature', 'yourProduct', and 'competitor' properties, comparing at least 5 key features, metrics, or aspects)
                    
                    Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditJSON)}` :
                    
                    `Analyze the following Reddit discussions related to '${product}' and its competitor '${competitor}' in the '${industry}' industry. Provide a comparative analysis focusing on how the competitor is perceived compared to ${product}.
                    
                    Structure the output in JSON format with the following keys:
                    - 'overview' (general comparison)
                    - 'strengths' (competitor's strengths)
                    - 'weaknesses' (competitor's weaknesses)
                    - 'perception' (how users perceive the competitor in the market)
                    - 'recommendations' (strategic insights for ${product} based on competitor analysis)
                    - 'comparisonTable' (an array of objects, each with 'feature', 'yourProduct', and 'competitor' properties, comparing at least 5 key features, metrics, or aspects)
                    
                    Your response MUST be valid JSON parseable by JSON.parse() with no additional text. Data: ${JSON.stringify(redditJSON)}`;
                    

                const geminiAnalysisResponse = await axios.post(
                    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
                    {
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: analysisPrompt }]
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
            
                let analysisText = geminiAnalysisResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                
                // Improved JSON extraction - find the first { and the last }
                const firstBrace = analysisText.indexOf('{');
                const lastBrace = analysisText.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    analysisText = analysisText.substring(firstBrace, lastBrace + 1);
                }
                
                // Remove markdown formatting
                analysisText = analysisText.replace(/```json|```/g, "").trim();
                
                let structuredAnalysis;
                try {
                    structuredAnalysis = JSON.parse(analysisText);
                } catch (error) {
                    console.error("Error parsing competitor analysis from Gemini:", error);
                    console.error("Raw text causing error:", analysisText);
                    structuredAnalysis = {
                        overview: `Analysis of ${product} versus ${competitor}`,
                        strengths: `${competitor}'s strengths compared to ${product}`,
                        weaknesses: `${competitor}'s weaknesses compared to ${product}`,
                        perception: `How ${competitor} is perceived in the market`,
                        recommendations: `Strategic recommendations for ${product} based on ${competitor}'s market position`,
                        comparisonTable: [
                            {
                                feature: "Pricing",
                                yourProduct: "No data available",
                                competitor: "No data available"
                            },
                            {
                                feature: "User Experience",
                                yourProduct: "No data available",
                                competitor: "No data available"
                            },
                            {
                                feature: "Features",
                                yourProduct: "No data available",
                                competitor: "No data available"
                            },
                            {
                                feature: "Customer Support",
                                yourProduct: "No data available",
                                competitor: "No data available"
                            },
                            {
                                feature: "Market Share",
                                yourProduct: "No data available",
                                competitor: "No data available"
                            }
                        ]
                    };
                }
            
                res.json({ analysis: structuredAnalysis });
            
            } catch (err) {
                console.error("Error processing competitor analysis with Gemini:", err);
                if (!res.headersSent) {
                    return res.status(500).json({ error: "Error processing competitor analysis" });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to analyze a product for consumers
app.post("/analyze-product", async (req, res) => {
    const { productName, compareProduct } = req.body;
    
    if (!productName) {
        return res.status(400).json({ error: "Product name is required" });
    }
    
    try {
        // Step 1: Ask Gemini API to determine the best subreddits for this product
        const prompt = compareProduct 
            ? `Given the product '${productName}' and another product '${compareProduct}', suggest relevant Reddit subreddits where discussions about these products are likely found. These could be product-specific subreddits, review subreddits, or subreddits related to the product category. Only return 2 subreddit names in a JSON array format.`
            : `Given the product '${productName}', suggest relevant Reddit subreddits where discussions or reviews about this product are likely found. These could be product-specific subreddits, review subreddits, or subreddits related to the product category. Only return 2 subreddit names in a JSON array format.`;
            
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
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
        
        console.log(`Using subreddits for product analysis: ${subreddits}`);

        // Step 2: Call Python script to fetch Reddit data from those subreddits
        const searchQuery = compareProduct 
            ? `${productName} OR ${compareProduct}`
            : productName;
            
        const pythonProcess = spawn("python", ["fetch_reddit.py", JSON.stringify(subreddits), searchQuery]);
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
            
                // Step 3: Process the fetched data using Gemini API for consumer-focused insights
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
                    
                    Data: ${JSON.stringify(redditJSON)}`
                    
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
                    
                    Data: ${JSON.stringify(redditJSON)}`;
                    
                const geminiAnalysisResponse = await axios.post(
                    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
                    {
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: analysisPrompt }]
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
            
                let analysisText = geminiAnalysisResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                
                // Clean up the response - extract just the JSON
                const firstBrace = analysisText.indexOf('{');
                const lastBrace = analysisText.lastIndexOf('}');
                
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    analysisText = analysisText.substring(firstBrace, lastBrace + 1);
                }
                
                // Remove markdown formatting if present
                analysisText = analysisText.replace(/```json|```/g, "").trim();
                
                let productAnalysis;
                try {
                    productAnalysis = JSON.parse(analysisText);
                } catch (error) {
                    console.error("Error parsing product analysis from Gemini:", error);
                    
                    // Provide a fallback analysis structure
                    if (compareProduct) {
                        productAnalysis = {
                            overview: `Analysis of ${productName} compared to ${compareProduct}`,
                            productAnalysis: {
                                pros: ["Could not extract pros"],
                                cons: ["Could not extract cons"],
                                valueRating: "N/A",
                                idealFor: ["General users"]
                            },
                            competitorAnalysis: {
                                pros: ["Could not extract pros"],
                                cons: ["Could not extract cons"],
                                valueRating: "N/A",
                                idealFor: ["General users"]
                            },
                            comparisonTable: [
                                {
                                    feature: "Overall Quality",
                                    product1: "No data available",
                                    product2: "No data available"
                                }
                            ],
                            verdict: "Could not determine a verdict based on available data"
                        };
                    } else {
                        productAnalysis = {
                            overview: `Analysis of ${productName}`,
                            pros: ["Could not extract pros from the data"],
                            cons: ["Could not extract cons from the data"],
                            valueForMoney: "Unable to determine value assessment",
                            valueRating: "N/A",
                            alternatives: ["No alternatives identified"],
                            idealFor: ["General users"],
                            verdict: "Insufficient data to provide a recommendation"
                        };
                    }
                }
            
                res.json({ 
                    productName,
                    compareProduct: compareProduct || null,
                    analysis: productAnalysis 
                });
            
            } catch (err) {
                console.error("Error processing with Gemini:", err);
                if (!res.headersSent) {
                    return res.status(500).json({ error: "Error processing product analysis" });
                }
            }
            
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to get personalized product recommendations
app.post("/recommend-products", async (req, res) => {
    const { needsDescription, category, priceRange } = req.body;
    
    if (!needsDescription || !category || !priceRange) {
        return res.status(400).json({ error: "Description, category and price range are all required" });
    }
    
    try {
        // Step 1: Ask Gemini API to determine relevant subreddits for this product category
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `Given the product category '${category}', suggest relevant Reddit subreddits where discussions and recommendations about products in this category are likely found. Only return 2 subreddit names in a JSON array format.` }]
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
        subredditsText = subredditsText.replace(/```json|```/g, " ").trim();
        
        let subreddits;
        try {
            subreddits = JSON.parse(subredditsText);
        } catch (error) {
            console.error("Error parsing subreddits from Gemini:", error);
            subreddits = [];
        }
        
        if (!Array.isArray(subreddits) || subreddits.length === 0) {
            subreddits = ["all"];
        }
        
        console.log(`Using subreddits for recommendations: ${subreddits}`);

        // Step 2: Fetch relevant discussions from Reddit
        const pythonProcess = spawn("python", [
            "fetch_reddit.py", 
            JSON.stringify(subreddits), 
            category
        ]);
        
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
                
                // Step 3: Use Gemini API to generate personalized recommendations based on user needs
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
                    
                    Data: ${JSON.stringify(redditJSON)}
                `;
                
                const geminiRecommendationsResponse = await axios.post(
                    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent",
                    {
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: recommendationsPrompt }]
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
            
                let recommendationsText = geminiRecommendationsResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                
                // Clean up the response - extract just the JSON
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
                
                res.json({
                    userRequirements: {
                        needsDescription,
                        category,
                        priceRange
                    },
                    recommendations
                });
                
            } catch (err) {
                console.error("Error processing with Gemini:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Error generating product recommendations" });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
