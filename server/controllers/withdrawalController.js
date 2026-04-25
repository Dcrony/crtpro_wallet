import { validationResult } from 'express-validator';
import Withdrawal from '../models/Withdrawal.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';

/**
 * @desc    Create withdrawal request
 * @route   POST /api/withdrawals
 * @access  Private (User)
 */
export const createWithdrawal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, walletAddress } = req.body;
    const withdrawAmount = parseFloat(amount);

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check sufficient USDT balance (withdrawals are in USDT)
    if (wallet.balanceUSDT < withdrawAmount) {
      return res.status(400).json({ message: 'Insufficient USDT balance' });
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: req.user.id,
      amount: withdrawAmount,
      walletAddress,
      status: 'pending',
    });

    // Create corresponding transaction record
    await Transaction.create({
      userId: req.user.id,
      type: 'withdraw',
      amount: withdrawAmount,
      currency: 'USDT',
      status: 'pending',
    });

    // Deduct balance immediately (or wait for admin approval - your choice)
    // Here we deduct immediately but mark as pending admin approval for sending
    wallet.balanceUSDT -= withdrawAmount;
    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted. Admin will process shortly.',
      withdrawal,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get user's withdrawals
 * @route   GET /api/withdrawals
 * @access  Private (User)
 */
export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { createWithdrawal, getWithdrawals };