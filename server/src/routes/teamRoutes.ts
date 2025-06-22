import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { createTeam, getProjectsByTeam } from "../controllers/teamController";

const router = express.Router();

router.post("/", authenticate, createTeam);
router.get("/:teamId/projects", authenticate, getProjectsByTeam);

export default router;
