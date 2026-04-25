import express from 'express';
import { body } from 'express-validator';
import {
  createDeposit,
  convertCurrency,
  getTransactions,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation
const amountValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be at least 0.01'),
];

// Routes
router.post('/deposit', protect, amountValidation, createDeposit);
router.post('/convert', protect, amountValidation, convertCurrency);
router.get('/', protect, getTransactions);

export default router;