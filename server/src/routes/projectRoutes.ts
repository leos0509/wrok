import express from "express";
import { createProject, getProjectById, getProjectColumns, getProjects } from "../controllers/projectController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.get("/:id", authenticate, getProjectById);
router.get("/:projectId/columns", authenticate, getProjectColumns);

export default router;
