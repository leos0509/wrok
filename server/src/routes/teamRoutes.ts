import express from 'express';
import { getProjectsByTeam } from '../controllers/projectController';

const router = express.Router();

router.get('/:teamId', getProjectsByTeam);

export default router;