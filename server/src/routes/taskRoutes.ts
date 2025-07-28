import express from "express";
import {
  createTask,
  createTaskChecklist,
  deleteTask,
  getTaskAssignees,
  getTaskById,
  getTaskChecklists,
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
router.get("/:taskId/checklists", getTaskChecklists)
router.post("/", createTask);
router.put("/update-multiple", updateMultipleTasks);
router.put("/update-single", updateSingleTask);
router.put("/update-assignees", updateTaskAssignees);
router.post("/:taskId/tags", linkTaskToTag);
router.post("/:taskId/checklists", createTaskChecklist);
router.delete("/:taskId", deleteTask);
router.delete("/:taskId/tags/:tagId", unlinkTaskFromTag);
router.delete("/:taskId/tags", unlinkAllTagsFromTask);

export default router;
