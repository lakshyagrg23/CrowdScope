import express from "express";
import axios from "axios";
import { spawn } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import analysisRoute from "./routes/analysisRoute.js";
import competitorRoute from "./routes/competitorRoute.js";
import competitorAnalysisRoute from "./routes/competitorAnalysisRoute.js";
import productAnalysisRoute from "./routes/productAnalysisRoute.js";
import recommendationRoute from "./routes/recommendationRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/analyze", analysisRoute);
app.use("/find-competitors", competitorRoute);
app.use("/competitor-analysis", competitorAnalysisRoute);
app.use("/analyze-product", productAnalysisRoute);
app.use("/recommend-products", recommendationRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
