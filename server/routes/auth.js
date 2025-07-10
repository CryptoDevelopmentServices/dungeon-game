import express from 'express';
import User from "../models/User.js";
import methods from "../daemon/methods.js";
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username: username }
    });

    if (user) {
      return res.status(400).json({ error: "Username already exists" })
    }

    const address = await methods.generateAddress(username)

    await User.create({
      username: username,
      password: password,
      wallet_address: address
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username: username,
      password: password,
    }
  });
  if (!user) return res.status(401).json({ error: 'Invalid login' });
  res.json({ success: true, user });
});

export default router;
