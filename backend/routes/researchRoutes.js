import express from "express";
import { researchController } from "../controllers/researchController.js";

const router = express.Router();

router.post("/", researchController);

export default router;