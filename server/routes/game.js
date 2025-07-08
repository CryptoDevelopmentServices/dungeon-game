import express from 'express';
import { db } from '../db/sql.js';
const router = express.Router();

router.post('/reward', async (req, res) => {
  const { username, amount } = req.body;
  await db.run('UPDATE users SET balance = balance + ? WHERE username = ?', [amount, username]);
  res.json({ success: true });
});

router.get('/profile/:username', async (req, res) => {
  const user = await db.get('SELECT username, balance, wallet_address FROM users WHERE username = ?', [req.params.username]);
  res.json(user);
});

export default router;
