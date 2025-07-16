import express from 'express';
import { createTask, updateTasks } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask);
router.put('/update-multiple', updateTasks);

export default router;