import express from 'express';
import { register, login, refresh } from '../controllers/authController.js';
import { userSchema } from './schemas/authSchema.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/login', validate(userSchema), login);
router.post('/refresh', refresh)

export default router;
