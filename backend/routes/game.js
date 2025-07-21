import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { reward, profile, withdraw } from '../controllers/gameController.js';
import { rewardSchema, withdrawSchema } from './schemas/gameSchema.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/reward', validate(rewardSchema), reward);
router.get('/profile', profile);
router.post('/withdraw', validate(withdrawSchema), withdraw);

export default router;
