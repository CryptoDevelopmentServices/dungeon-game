import express from 'express';
const router = express.Router();

router.post('/withdraw', async (req, res) => {
  // Connect to your ADVC wallet via RPC and call sendtoaddress
  res.json({ success: true, txid: 'mock-tx-id' });
});

export default router;
