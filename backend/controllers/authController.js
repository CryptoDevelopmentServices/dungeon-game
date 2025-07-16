import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.js';

dotenv.config();

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  const { username, password, walletAddress } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(409).json({ message: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, passwordHash, walletAddress });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.json({ token, username: user.username, balance: user.balance, walletAddress: user.walletAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
