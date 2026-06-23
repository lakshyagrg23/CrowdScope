import express from "express";
import { recommendProducts } from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/", recommendProducts);

export default router;
