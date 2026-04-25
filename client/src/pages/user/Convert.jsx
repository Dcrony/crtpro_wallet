import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import Navbar from '../../components/Navbar.jsx';

/**
 * Convert - Currency Conversion Page
 * Converts USD to USDT using admin-set rate
 */
const Convert = () => {
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(null);
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, rateRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/admin/rate'), // Public endpoint or separate rate endpoint
      ]);
      setWallet(walletRes.data.wallet);
      setRate(rateRes.data.rate);
    } catch (error) {
      // Rate might fail for users, use default
      setRate(1);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    
    const convertAmount = parseFloat(amount);
    if (!convertAmount || convertAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (wallet?.balanceUSD < convertAmount) {
      toast.error('Insufficient USD balance');
      return;
    }

    setConverting(true);

    try {
      const res = await api.post('/transactions/convert', {
        amount: convertAmount,
      });
      toast.success(res.data.message);
      setWallet(res.data.wallet);
      setAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const estimatedUSDT = amount ? (parseFloat(amount) * rate).toFixed(2) : '0.00';

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '32px', maxWidth: '600px' }}>
        <h1 className="page-title">Convert USD → USDT</h1>

        <div className="card">
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
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Available USD</div>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>
                ${wallet?.balanceUSD?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Current Rate</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                1 USD = {rate} USDT
              </div>
            </div>
          </div>

          <form onSubmit={handleConvert}>
            <div className="form-group">
              <label>Amount to Convert (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter USD amount"
                required
              />
            </div>

            <div
              style={{
                padding: '16px',
                background: '#0f172a',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
                You will receive approximately
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                {estimatedUSDT} USDT
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={converting}
            >
              {converting ? 'Converting...' : 'Convert Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Convert;