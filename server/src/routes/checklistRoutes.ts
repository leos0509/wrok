import express from "express";
import { createChecklistItem, deleteChecklistItem, getChecklist } from "../controllers/checklistController";

const router = express.Router();

// ROUTES
router.get("/:checklistId", getChecklist);
router.post("/:checklistId/items", createChecklistItem);
router.delete("/:checklistId/items/:itemId", deleteChecklistItem);

export default router;
