import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    walletAddress: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'rejected'],
      default: 'pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
    // When admin marks as sent, record the tx hash (manual entry)
    txHash: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;