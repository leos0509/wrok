import express from "express";
import { addAssignee, removeAssignee } from "../controllers/assigneeController";

const router = express.Router();

router.post("/add", addAssignee);
router.post("/remove", removeAssignee);

export default router;
