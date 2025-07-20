import express from 'express';
import User from "../models/User.js";
import { config } from '../daemon_conf.js';
import methods from "../daemon/methods.js";
import { withdrawSchema } from "./schemas/walletSchema.js";
import validate from "../middlewares/validationMiddleware.js";
import authenticate from "../middlewares/jwtMiddleware.js";
const router = express.Router();

router.post('/withdraw', authenticate, validate(withdrawSchema), async (req, res) => {
  // Connect to your ADVC wallet via RPC and call sendtoaddress
  try {
    const {address, amount} = req.body;
    const username = req.user.username;

    // First check user bal and see if they have enough to withdraw
    const user = await User.findOne(
        {
          where: {username: username}
        }
    );

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // Should we use DB balance or daemon balance
    // const response = await methods.getBalance()

    // For here, i dont know how we should reflect the minimum fee, there isnt any
    // json-rpc api to get the fee
    if (amount > user.balance + config.transaction.minFee) {
      return res.status(400).json({error: `Amount must be less than your balance + min fee ${config.transaction.minFee}`});
    }

    // Execute transaction
    const txid = await methods.withdrawFrom(
        username,
        address,
        amount
    );

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

    res.json({success: true, txid: txid});
  } catch (e) {
    console.error("[WITHDRAW ERROR]", e)
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.get('/transactions', authenticate, async (req, res) => {
  try {
    const username = req.user.username;
    const type = req.query.type;
    const page = Number(req.query.page);
    const size = Number(req.query.size);
    const skip = (page - 1) * size;

    if (!["send", "receive"].includes(type)) {
      return res.status(400).json({error: 'Invalid transaction type'});
    }

    const transactions = await methods.getTransactions(
        username,
        size,
        skip
    );

    const filtered_transactions = transactions
        .filter(tx => tx.category === type)
        .map(tx => {
          return { txid: tx.txid, confs: tx.confirmations, amount: Math.abs(tx.amount) }
        });

    // We can check if there is a next page by checking there
    // are txs after next skip
    const next_txs = await methods.getTransactions(
        username,
        size,
        skip + size
    );

    const filtered_next_txs = next_txs
        .filter(tx => tx.category === type);

    res.status(200).json({ transactions: filtered_transactions, has_next: filtered_next_txs.length > 0 });

  } catch (e) {
    console.error('[TRANSACTIONS ERROR]', e);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

export default router;
