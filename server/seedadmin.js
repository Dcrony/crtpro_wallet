import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Wallet from './models/Wallet.js';
import ConversionRate from './models/ConversionRate.js';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    
    await Wallet.create({
      userId: admin._id,
      balanceUSD: 0,
      balanceUSDT: 0,
    });
    
    console.log('Admin created: admin@example.com / admin123');
  } else {
    console.log('Admin already exists');
  }
  
  // Initialize conversion rate
  const rateExists = await ConversionRate.findOne();
  if (!rateExists) {
    await ConversionRate.create({
      rate: 1.0,
      updatedBy: adminExists?._id || new mongoose.Types.ObjectId(),
    });
    console.log('Default conversion rate set: 1.0');
  }
  
  process.exit();
};

seedAdmin();