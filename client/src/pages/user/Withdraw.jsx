import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import Navbar from '../../components/Navbar.jsx';

/**
 * Withdraw - Withdrawal Request Page
 * Creates pending withdrawal for admin to process manually
 */
const Withdraw = () => {
  const [formData, setFormData] = useState({ amount: '', walletAddress: '' });
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data.wallet);
    } catch (error) {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (wallet?.balanceUSDT < amount) {
      toast.error('Insufficient USDT balance');
      return;
    }

    if (!formData.walletAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/withdrawals', {
        amount,
        walletAddress: formData.walletAddress.trim(),
      });
      toast.success('Withdrawal request submitted! Admin will process it.');
      setFormData({ amount: '', walletAddress: '' });
      fetchWallet(); // Refresh balance
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '32px', maxWidth: '600px' }}>
        <h1 className="page-title">Withdraw USDT</h1>

        <div className="card">
          <div
            style={{
              background: '#ef444420',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <p style={{ color: '#ef4444', fontSize: '14px' }}>
              ⚠️ <strong>Manual Withdrawal:</strong> Submit your withdrawal
              request. An admin will manually send crypto to your address and
              mark it as sent. No automatic transfers occur.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
              padding: '16px',
              background: '#0f172a',
              borderRadius: '8px',
            }}
          >
            <div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Available USDT</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>
                {wallet?.balanceUSDT?.toFixed(2) || '0.00'} USDT
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount (USDT)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter USDT amount"
                required
              />
            </div>

            <div className="form-group">
              <label>Destination Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Enter USDT wallet address (TRC20/ERC20)"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: '100%' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Request Withdrawal'}
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
              <strong>Note:</strong> Funds will be deducted from your balance
              immediately and held until admin processes the withdrawal. If
              rejected, funds will be refunded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;