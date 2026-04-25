import Wallet from '../models/Wallet.js';

/**
 * @desc    Get user's wallet
 * @route   GET /api/wallet
 * @access  Private (User)
 */
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({
      success: true,
      wallet: {
        balanceUSD: wallet.balanceUSD,
        balanceUSDT: wallet.balanceUSDT,
      },
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { getWallet };