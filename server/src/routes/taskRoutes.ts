import express from 'express';
import { createTask, updateTaskPosition } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask);
router.put('/update-position', updateTaskPosition);

export default router;