import express from 'express';
import { body } from 'express-validator';
import {
  createWithdrawal,
  getWithdrawals,
} from '../controllers/withdrawalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const withdrawalValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be at least 0.01'),
  body('walletAddress')
    .trim()
    .notEmpty()
    .withMessage('Wallet address is required'),
];

router.post('/', protect, withdrawalValidation, createWithdrawal);
router.get('/', protect, getWithdrawals);

export default router;