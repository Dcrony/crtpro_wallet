import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import Withdrawal from '../models/Withdrawal.js';
import ConversionRate from '../models/ConversionRate.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Attach wallet info to each user
    const usersWithWallets = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ userId: user._id }).lean();
        return {
          ...user,
          wallet: wallet || { balanceUSD: 0, balanceUSDT: 0 },
        };
      })
    );

    res.json({
      success: true,
      users: usersWithWallets,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all pending deposits
 * @route   GET /api/admin/deposits
 * @access  Private (Admin)
 */
export const getPendingDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({
      type: 'deposit',
      status: 'pending',
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      deposits,
    });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Approve or reject deposit
 * @route   PUT /api/admin/deposits/:id
 * @access  Private (Admin)
 */
export const processDeposit = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    transaction.status = status;
    if (adminNote) transaction.adminNote = adminNote;

    // If approved, add funds to user's wallet
    if (status === 'approved') {
      const wallet = await Wallet.findOne({ userId: transaction.userId });
      if (wallet) {
        wallet.balanceUSD += transaction.amount;
        await wallet.save();
      }
    }

    await transaction.save();

    res.json({
      success: true,
      message: `Deposit ${status}`,
      transaction,
    });
  } catch (error) {
    console.error('Process deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all pending withdrawals
 * @route   GET /api/admin/withdrawals
 * @access  Private (Admin)
 */
export const getPendingWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      status: 'pending',
    })
      .populate('userId', 'name email')
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

/**
 * @desc    Process withdrawal (mark as sent or rejected)
 * @route   PUT /api/admin/withdrawals/:id
 * @access  Private (Admin)
 */
export const processWithdrawal = async (req, res) => {
  try {
    const { status, adminNote, txHash } = req.body;
    const { id } = req.params;

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = status;
    if (adminNote) withdrawal.adminNote = adminNote;
    if (txHash) withdrawal.txHash = txHash;

    // If rejected, refund the USDT to user's wallet
    if (status === 'rejected') {
      const wallet = await Wallet.findOne({ userId: withdrawal.userId });
      if (wallet) {
        wallet.balanceUSDT += withdrawal.amount;
        await wallet.save();
      }
    }

    await withdrawal.save();

    // Update corresponding transaction status
    await Transaction.findOneAndUpdate(
      { userId: withdrawal.userId, type: 'withdraw', amount: withdrawal.amount, status: 'pending' },
      { status: status === 'sent' ? 'approved' : 'rejected', adminNote }
    );

    res.json({
      success: true,
      message: `Withdrawal ${status}`,
      withdrawal,
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get current conversion rate
 * @route   GET /api/admin/rate
 * @access  Private (Admin)
 */
export const getConversionRate = async (req, res) => {
  try {
    const rateDoc = await ConversionRate.getCurrentRate();
    res.json({
      success: true,
      rate: rateDoc.rate,
      updatedAt: rateDoc.updatedAt,
    });
  } catch (error) {
    console.error('Get rate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Set conversion rate
 * @route   PUT /api/admin/rate
 * @access  Private (Admin)
 */
export const setConversionRate = async (req, res) => {
  try {
    const { rate } = req.body;
    const newRate = parseFloat(rate);

    if (newRate <= 0) {
      return res.status(400).json({ message: 'Rate must be greater than 0' });
    }

    const rateDoc = await ConversionRate.getCurrentRate();
    rateDoc.rate = newRate;
    rateDoc.updatedBy = req.user.id;
    await rateDoc.save();

    res.json({
      success: true,
      message: 'Conversion rate updated',
      rate: newRate,
    });
  } catch (error) {
    console.error('Set rate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingDeposits = await Transaction.countDocuments({
      type: 'deposit',
      status: 'pending',
    });
    const pendingWithdrawals = await Withdrawal.countDocuments({
      status: 'pending',
    });
    const totalTransactions = await Transaction.countDocuments();

    // Get total balances across all users
    const wallets = await Wallet.find().lean();
    const totalUSDBalance = wallets.reduce((sum, w) => sum + w.balanceUSD, 0);
    const totalUSDTBalance = wallets.reduce((sum, w) => sum + w.balanceUSDT, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingDeposits,
        pendingWithdrawals,
        totalTransactions,
        totalUSDBalance,
        totalUSDTBalance,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getAllUsers,
  getPendingDeposits,
  processDeposit,
  getPendingWithdrawals,
  processWithdrawal,
  getConversionRate,
  setConversionRate,
  getDashboardStats,
};