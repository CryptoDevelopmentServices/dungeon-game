import express from 'express';
import User from "../models/User.js";
import { config } from '../daemon_conf.js';
import methods from "../daemon/methods.js";
const router = express.Router();

router.post('/withdraw', async (req, res) => {
  // Connect to your ADVC wallet via RPC and call sendtoaddress
  const { username, address, amount } = req.body;

  // First check user bal and see if they have enough to withdraw
  const user = await User.findOne(
      {
        where: { username: username }
      }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Should we use DB balance or daemon balance
  // const response = await methods.getBalance()

  // For here, i dont know how we should reflect the minimum fee, there isnt any
  // json-rpc api to get the fee
  if (amount > user.balance + config.transaction.minFee) {
    return res.status(400).json({ error: `Amount must be less than your balance + min fee ${config.transaction.minFee}` })
  }

  // Execute transaction
  const txid = await methods.withdrawFrom(
      username,
      address,
      amount
  )

  // Then decrement value in db
  // await user.decrement(
  //     {
  //       This definitely needs to be changed, it should reflect the actual transaction fee, not the
  //       hardcoded min fee we set. For not leaving it here
  //       balance: amount + config.transaction.minFee
  //     },
  //     {
  //       where: { username: username }
  //     }
  // )

  res.json({ success: true, txid: txid });
});

export default router;
