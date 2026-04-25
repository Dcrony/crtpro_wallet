import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import transactionRoutes from './routes/transactions.js';
import withdrawalRoutes from './routes/withdrawals.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';



// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});