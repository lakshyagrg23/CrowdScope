import express from "express";
import { findCompetitors } from "../controllers/competitorController.js";

const router = express.Router();

router.post("/", findCompetitors);

export default router;