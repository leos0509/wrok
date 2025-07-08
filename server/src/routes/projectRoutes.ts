import express from "express";
import { createProject, getProjectById, getProjectColumns, getProjects, getProjectTasks } from "../controllers/projectController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.get("/:projectId/columns", authenticate, getProjectColumns);
router.get("/:projectId/tasks", authenticate, getProjectTasks);

export default router;
