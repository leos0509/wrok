import express from "express";
import { createProject, getProjects } from "../controllers/projectController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);

export default router;
