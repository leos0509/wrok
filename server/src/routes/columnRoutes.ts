import express from "express";
import {
  createColumn,
  deleteColumn,
  getColumnTasks,
  updateColumnOrder,
  updateColumns,
} from "../controllers/columnController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createColumn);
router.get("/:columnId/tasks", authenticate, getColumnTasks);
router.put("/", authenticate, updateColumns);
router.delete("/:columnId", deleteColumn);
router.put("/:columnId/order", authenticate, updateColumnOrder);
export default router;
