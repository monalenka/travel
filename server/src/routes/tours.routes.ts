import { Router } from 'express';
import { getTours, getTourById } from '../controllers/tours.controller';

const router = Router();

// GET /api/tours - все активные туры
router.get('/', getTours);

// GET /api/tours/:id - тур по ID
router.get('/:id', getTourById);

export default router;