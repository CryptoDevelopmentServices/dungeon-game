import { User } from '../models/user.js';

// Reward endpoint — adds ADVC to user balance
export const reward = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid reward amount' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += amount;
    await user.save();

    res.json({ message: `Rewarded ${amount} ADVC`, balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile endpoint — returns user info
export const profile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId, {
      attributes: ['username', 'balance', 'walletAddress'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Withdraw endpoint — placeholder for now
export const withdraw = async (req, res) => {
  const { amount, address } = req.body;
  const userId = req.user.id;

  if (typeof amount !== 'number' || amount <= 0 || !address) {
    return res.status(400).json({ message: 'Invalid withdraw request' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // TODO: Integrate with ADVC RPC to send coins here.

    user.balance -= amount;
    await user.save();

    res.json({ message: `Withdrawal of ${amount} ADVC requested`, balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
