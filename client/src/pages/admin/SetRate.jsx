import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';

/**
 * SetRate - Admin Conversion Rate Management
 * Allows admin to set USD → USDT conversion rate
 */
const SetRate = () => {
  const [rate, setRate] = useState('');
  const [currentRate, setCurrentRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRate();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await api.get('/admin/rate');
      setCurrentRate(res.data.rate);
      setRate(res.data.rate.toString());
    } catch (error) {
      toast.error('Failed to load current rate');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newRate = parseFloat(rate);
    if (!newRate || newRate <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }

    setSaving(true);

    try {
      await api.put('/admin/rate', { rate: newRate });
      toast.success('Conversion rate updated successfully');
      setCurrentRate(newRate);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update rate');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: '32px', maxWidth: '600px' }}>
        <h1 className="page-title">Set Conversion Rate</h1>

        <div className="card">
          <div
            style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
              Current Rate
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#10b981' }}>
              1 USD = {currentRate} USDT
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Rate (USD → USDT)</label>
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Enter new rate"
                required
              />
            </div>

            <div
              style={{
                padding: '16px',
                background: '#f59e0b10',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <p style={{ color: '#f59e0b', fontSize: '14px' }}>
                ⚠️ <strong>Important:</strong> Changing this rate affects all
                future conversions. Existing balances are not affected.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Rate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetRate;