import express from "express";
import { getProductAnalysis } from "../controllers/productAnalysisController.js";

const router = express.Router();

router.post("/", getProductAnalysis);

export default router;
