import express from 'express';
import { db } from '../db/sql.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Username taken' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (!user) return res.status(401).json({ error: 'Invalid login' });
  res.json({ success: true, user });
});

export default router;
