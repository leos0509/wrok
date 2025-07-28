import express from "express";
import { getChecklist } from "../controllers/checklistController";

const router = express.Router();

// ROUTES
router.get("/:checklistId", getChecklist);

export default router;
