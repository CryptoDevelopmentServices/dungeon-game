import express from 'express';
import User from "../models/User.js";
import methods from "../daemon/methods.js";
import { rewardSchema } from "./schemas/gameSchema.js";
import validate from "../middlewares/validationMiddleware.js";
import authenticate from "../middlewares/jwtMiddleware.js";

const router = express.Router();

router.put('/reward', authenticate, validate(rewardSchema), async (req, res) => {
    const username = req.user.username;
    const amount = req.body.amount;

    try {
        // try update balance on daemon side first
        await methods.moveAmount(
            "",
            username,
            amount
        )

        await User.increment(
            {
                balance: amount
            },
            {
                where: {username: username}
            }
        );

        res.status(200).json({success: true});
    } catch (error) {
        console.error('[REWARD ERROR]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/profile', authenticate, async (req, res) => {
  const username = req.user.username;
  const user = await User.findOne(
      {
        where: {
          username: username
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
