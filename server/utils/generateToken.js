import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated user
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export default generateToken;