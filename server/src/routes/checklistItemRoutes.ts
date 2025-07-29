import express from "express";
import { updateChecklistItem } from "../controllers/checklistItemController";

const router = express.Router();

router.put("/:itemId", updateChecklistItem);

export default router;
