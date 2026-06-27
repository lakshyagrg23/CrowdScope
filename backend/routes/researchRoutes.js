import express from "express";
import { createResearchController, getResearchController, getAllResearchController, deleteResearchController, getResearchDetailsController } from "../controllers/researchController.js";

const router = express.Router();

router.get("/", getAllResearchController);
router.post("/", createResearchController);
router.get("/:id", getResearchController);
router.get("/:id/details", getResearchDetailsController);
router.delete("/:id", deleteResearchController);

export default router;