import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import Navbar from '../../components/Navbar.jsx';

/**
 * Deposit - User Deposit Request Page
 * Creates a pending deposit transaction for admin approval
 */
const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      await api.post('/transactions/deposit', { amount: parseFloat(amount) });
      toast.success('Deposit request submitted! Admin will review shortly.');
      setAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '32px', maxWidth: '600px' }}>
        <h1 className="page-title">Deposit Funds</h1>

        <div className="card">
          <div
            style={{
              background: '#f59e0b20',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <p style={{ color: '#f59e0b', fontSize: '14px' }}>
              ⚠️ <strong>Manual Deposit System:</strong> Submit your deposit
              request here. An admin will review and approve it. No real payment
              processing occurs automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to deposit"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#1e293b',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '13px',
            }}
          >
            <p>
              <strong>Note:</strong> After submission, your deposit will be
              marked as "pending". Once an admin approves it, the funds will be
              added to your USD balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;