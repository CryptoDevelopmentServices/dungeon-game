import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.js';
import methods from '../daemon/methods.js';

dotenv.config();

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(409).json({ message: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const walletAddress = await methods.generateAddress(username);
    await User.create({ username, passwordHash, walletAddress });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const refresh_token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res
    .cookie(
      'refreshToken', refresh_token, { httpOnly: true, sameSite: 'strict' }
    )
    .json({ token, username: user.username, balance: user.balance, walletAddress: user.walletAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  const jwt_secret = process.env.JWT_SECRET;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Invalid refreshToken' });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwt_secret);
    const token = jwt.sign(
        { username: decoded.username },
        jwt_secret,
        {
          expiresIn: '12h'
        }
    );
    res.json({ token, message: 'Refreshed token' })
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}
