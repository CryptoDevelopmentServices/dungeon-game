import express from 'express';
import User from "../models/User.js";
import methods from "../daemon/methods.js";
import validate from "../middlewares/validationMiddleware.js";
import { userSchema } from "./schemas/authSchema.js";

const router = express.Router();

// Register Route
router.post('/register', validate(userSchema), async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const address = await methods.generateAddress(username);

    await User.create({
      username,
      password,
      wallet_address: address,
      balance: "0"  // ✅ Set default balance
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[REGISTER ERROR]', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', validate(userSchema), async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username, password }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    // ✅ Return only safe fields
    res.json({
      success: true,
      user: {
        username: user.username,
        wallet_address: user.wallet_address,
        balance: user.balance
      }
    });
  } catch (e) {
    console.error('[LOGIN ERROR]', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
