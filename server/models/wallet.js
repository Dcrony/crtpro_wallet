import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wallet per user
    },
    balanceUSD: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    balanceUSDT: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;