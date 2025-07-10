import express from 'express';
import User from "../models/User.js";
const router = express.Router();

router.put('/reward', async (req, res) => {
  const { username, amount } = req.body;
  await User.update(
      {
        balance: amount
      },
      {
        where: {
          username: username
        }
      }
  );
  res.status(200).json({ success: true });
});

router.get('/profile/:username', async (req, res) => {
  const user = await User.findOne(
      {
        where: {
          username: req.params.username
        }
      }
  );

  if (!user) {
      return res.status(404).json({
          error: 'User does not exist'
      });
  }

  res.status(200).json(user);
});

export default router;
