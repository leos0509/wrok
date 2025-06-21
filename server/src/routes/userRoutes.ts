import express from 'express';
import { getUserTeams } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:userId/teams', authenticate, getUserTeams);

export default router;