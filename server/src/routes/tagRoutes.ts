import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { createTag } from "../controllers/tagController";

const router = express.Router();

router.post("/", authenticate, createTag);

export default router;
