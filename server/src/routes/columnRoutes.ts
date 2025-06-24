import express from "express";
import {
  createColumn,
  getColumnTaskAmount,
  getColumnTasks,
  updateColumns,
} from "../controllers/columnController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createColumn);
router.get("/:columnId/tasks", authenticate, getColumnTasks);
router.get("/:columnId/task-amount", authenticate, getColumnTaskAmount);
router.put("/", authenticate, updateColumns);
export default router;
