import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'convert', 'withdraw'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      enum: ['USD', 'USDT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // For conversions: store the converted amount
    convertedAmount: {
      type: Number,
      default: null,
    },
    // For conversions: store the rate used
    conversionRate: {
      type: Number,
      default: null,
    },
    // Admin notes for rejections
    adminNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;