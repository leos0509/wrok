import express from "express";
import { addMemeberToProject, createProject, getProjectById, getProjectColumns, getProjectMembers, getProjects, getProjectTasks } from "../controllers/projectController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createProject);
router.post("/:projectId/member", authenticate, addMemeberToProject);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.get("/:projectId/columns", authenticate, getProjectColumns);
router.get("/:projectId/tasks", authenticate, getProjectTasks);
router.get("/:projectId/members", authenticate, getProjectMembers);

export default router;
