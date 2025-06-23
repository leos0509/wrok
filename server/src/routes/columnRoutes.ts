import express from 'express';
import { createColumn, updateColumns } from '../controllers/columnController';

const router = express.Router();

router.post('/', createColumn);
router.put('/', updateColumns);

export default router;