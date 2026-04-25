import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import Navbar from '../../components/Navbar.jsx';

/**
 * Dashboard - User Wallet Overview
 * Shows USD and USDT balances with quick actions
 */
const Dashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/transactions'),
      ]);
      setWallet(walletRes.data.wallet);
      setTransactions(txRes.data.transactions.slice(0, 5)); // Last 5
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
      case 'sent':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1 className="page-title">Dashboard</h1>

        {/* Balance Cards */}
        <div className="grid-2" style={{ marginBottom: '32px' }}>
          <div className="balance-card">
            <h3>USD Balance</h3>
            <div className="amount">
              ${wallet?.balanceUSD?.toFixed(2) || '0.00'}
            </div>
            <div className="currency">US Dollars</div>
          </div>
          <div className="balance-card">
            <h3>USDT Balance</h3>
            <div className="amount">
              {wallet?.balanceUSDT?.toFixed(2) || '0.00'}
            </div>
            <div className="currency">Tether</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#94a3b8' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/deposit" className="btn btn-success">
              + Deposit
            </Link>
            <Link to="/convert" className="btn btn-primary">
              ⇄ Convert
            </Link>
            <Link to="/withdraw" className="btn btn-secondary">
              - Withdraw
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ color: '#94a3b8' }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ color: '#3b82f6' }}>
              View All →
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">No transactions yet</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td>{tx.currency}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;