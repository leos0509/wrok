import express from "express";
import {
  createChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  getChecklist,
  updateChecklistName,
} from "../controllers/checklistController";

const router = express.Router();

// ROUTES
router.get("/:checklistId", getChecklist);
router.post("/:checklistId/items", createChecklistItem);
router.delete("/:checklistId/items/:itemId", deleteChecklistItem);
router.put("/:checklistId/name", updateChecklistName);
router.delete("/:checklistId", deleteChecklist);

export default router;
