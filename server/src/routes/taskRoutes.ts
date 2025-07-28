import express from "express";
import {
  createTask,
  deleteTask,
  getTaskAssignees,
  getTaskById,
  linkTaskToTag,
  unlinkAllTagsFromTask,
  unlinkTaskFromTag,
  updateMultipleTasks,
  updateSingleTask,
  updateTaskAssignees,
} from "../controllers/taskController";

const router = express.Router();

router.get("/:taskId", getTaskById);
router.get("/:taskId/assignees", getTaskAssignees);
router.post("/", createTask);
router.put("/update-multiple", updateMultipleTasks);
router.put("/update-single", updateSingleTask);
router.put("/update-assignees", updateTaskAssignees);
router.post("/:taskId/link-tag", linkTaskToTag);
router.delete("/:taskId", deleteTask);
router.delete("/:taskId/unlink-tag/:tagId", unlinkTaskFromTag);
router.delete("/:taskId/tags", unlinkAllTagsFromTask);

export default router;
