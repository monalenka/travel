import { Router } from 'express';
import {
    adminLogin,
    adminLogout,
    adminStatus
} from '../controllers/admin.controller';

const router = Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/status', adminStatus);

export default router;