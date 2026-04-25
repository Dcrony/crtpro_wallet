import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import ConversionRate from '../models/ConversionRate.js';

/**
 * @desc    Create deposit request
 * @route   POST /api/transactions/deposit
 * @access  Private (User)
 */
export const createDeposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;

    // Create pending deposit transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      currency: 'USD',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Deposit request submitted for admin approval',
      transaction,
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Convert USD to USDT
 * @route   POST /api/transactions/convert
 * @access  Private (User)
 */
export const convertCurrency = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;
    const convertAmount = parseFloat(amount);

    // Get user's wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Check sufficient balance
    if (wallet.balanceUSD < convertAmount) {
      return res.status(400).json({ message: 'Insufficient USD balance' });
    }

    // Get current conversion rate
    const rateDoc = await ConversionRate.getCurrentRate();
    const rate = rateDoc.rate;
    const usdtAmount = convertAmount * rate;

    // Update wallet balances
    wallet.balanceUSD -= convertAmount;
    wallet.balanceUSDT += usdtAmount;
    await wallet.save();

    // Create conversion transaction (auto-approved for conversions)
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'convert',
      amount: convertAmount,
      currency: 'USD',
      status: 'approved',
      convertedAmount: usdtAmount,
      conversionRate: rate,
    });

    res.json({
      success: true,
      message: `Converted ${convertAmount} USD to ${usdtAmount.toFixed(2)} USDT`,
      transaction,
      wallet: {
        balanceUSD: wallet.balanceUSD,
        balanceUSDT: wallet.balanceUSDT,
      },
    });
  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get user's transaction history
 * @route   GET /api/transactions
 * @access  Private (User)
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { createDeposit, convertCurrency, getTransactions };