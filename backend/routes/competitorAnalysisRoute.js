import express from "express";
import { getCompetitorAnalysis } from "../controllers/competitorAnalysisController.js";

const router = express.Router();

router.post("/", getCompetitorAnalysis);

export default router;
