import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { reward, profile, withdraw } from '../controllers/gameController.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/reward', reward);
router.get('/profile', profile);
router.post('/withdraw', withdraw);

export default router;
