import express from 'express';
import { createColumn } from '../controllers/columnController';

const router = express.Router();

router.post('/', createColumn);

export default router;