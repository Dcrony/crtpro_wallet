import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import Navbar from '../../components/Navbar.jsx';

/**
 * Transactions - User Transaction History
 * Shows all deposits, conversions, and withdrawals
 */
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, wdRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/withdrawals'),
      ]);
      setTransactions(txRes.data.transactions);
      setWithdrawals(wdRes.data.withdrawals);
    } catch (error) {
      toast.error('Failed to load history');
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

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1 className="page-title">Transaction History</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['all', 'deposit', 'convert', 'withdraw'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn"
              style={{
                background: activeTab === tab ? '#3b82f6' : '#1e293b',
                color: activeTab === tab ? 'white' : '#94a3b8',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'all' ? 'All' : tab + 's'}
            </button>
          ))}
        </div>

        <div className="card">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">No transactions found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
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
                    <td style={{ color: '#64748b', fontSize: '13px' }}>
                      {tx.convertedAmount && `→ ${tx.convertedAmount.toFixed(2)} USDT`}
                      {tx.adminNote && <div>Note: {tx.adminNote}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Withdrawals Section */}
        <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#e2e8f0' }}>
          Withdrawal Requests
        </h2>
        <div className="card">
          {withdrawals.length === 0 ? (
            <div className="empty-state">No withdrawal requests</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Wallet Address</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>TX Hash</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((wd) => (
                  <tr key={wd._id}>
                    <td>{wd.amount.toFixed(2)} USDT</td>
                    <td
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={wd.walletAddress}
                    >
                      {wd.walletAddress}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(wd.status)}`}>
                        {wd.status}
                      </span>
                    </td>
                    <td>{new Date(wd.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>
                      {wd.txHash || '-'}
                    </td>
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

export default Transactions;