import { Router } from 'express';
import {
    getTours,
    getTourBySlug,
    getCategories,
    createTour,
    updateTour,
    deleteTour,
    getTourStats
} from '../controllers/tours.controller';
import { adminAuth } from '../middleware/admin.middleware';

const router = Router();

router.get('/', getTours);
router.get('/categories', getCategories);
router.get('/slug/:slug', getTourBySlug);

router.get('/stats', adminAuth, getTourStats);
router.post('/', adminAuth, createTour);
router.put('/:id', adminAuth, updateTour);
router.delete('/:id', adminAuth, deleteTour);

router.get('/:id', async (req, res) => {
    res.redirect(307, `/api/tours/slug/${req.params.id}`);
});

export default router;