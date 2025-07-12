import express from 'express';
import User from "../models/User.js";
import methods from "../daemon/methods.js";
import validate from "../middlewares/validationMiddleware.js";
import { userSchema } from "./schemas/authSchema.js";
import pkg from 'jsonwebtoken';
const router = express.Router();
const jwt = pkg;

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

    // Create JWT with secret
    const jwt_secret = process.env.JWT_SECRET
    const access_token = jwt.sign(
        { username },
        jwt_secret,
        {
          expiresIn: '1h'
        }
    );

    const refresh_token = jwt.sign(
        { username },
        jwt_secret,
        {
          expiresIn: '1d'
        }
    );

    // ✅ Return only safe fields
    res
        .cookie(
        'refreshToken', refresh_token, { httpOnly: true, sameSite: 'strict' }
        )
        .header('Authorization', 'Bearer ' + access_token)
        .json({
          success: true,
          user: {
            username: user.username,
            wallet_address: user.wallet_address,
            balance: user.balance
          }
        }
      )
  } catch (e) {
    console.error('[LOGIN ERROR]', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  const jwt_secret = process.env.JWT_SECRET

  if (!refreshToken) {
    return res.status(401).json({ error: 'Invalid refreshToken' });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwt_secret);
    const access_token = jwt.sign(
        { username: decoded.username },
        jwt_secret,
        {
          expiresIn: '1h'
        }
    );
    res
        .header('Authorization', 'Bearer ' + access_token)
        .json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

export default router;
