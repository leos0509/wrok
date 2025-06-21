import express from "express";
import { getProjectsByTeam } from "../controllers/projectController";
import { authenticate } from "../middlewares/authMiddleware";
import { createTeam } from "../controllers/teamController";

const router = express.Router();

router.post("/", authenticate, createTeam);
router.get("/:teamId", authenticate, getProjectsByTeam);

export default router;
