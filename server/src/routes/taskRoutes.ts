import express from 'express';
import { createTask, updateTaskPosition, updateTasks } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask);
router.put('/update-position', updateTaskPosition);
router.put('/update-multiple', updateTasks);

export default router;