import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getPendingDeposits,
  processDeposit,
  getPendingWithdrawals,
  processWithdrawal,
  getConversionRate,
  setConversionRate,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getAllUsers);

// Deposits
router.get('/deposits', getPendingDeposits);
router.put('/deposits/:id', processDeposit);

// Withdrawals
router.get('/withdrawals', getPendingWithdrawals);
router.put('/withdrawals/:id', processWithdrawal);

// Conversion Rate
router.get('/rate', getConversionRate);
router.put('/rate', body('rate').isFloat({ min: 0.0001 }), setConversionRate);

export default router;