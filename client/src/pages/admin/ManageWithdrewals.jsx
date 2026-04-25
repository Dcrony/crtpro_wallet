import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';

/**
 * ManageWithdrawals - Admin Withdrawal Processing
 * Lists pending withdrawals with send/reject actions
 */
const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [action, setAction] = useState('');
  const [txHash, setTxHash] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/admin/withdrawals');
      setWithdrawals(res.data.withdrawals);
    } catch (error) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (withdrawal, actionType) => {
    setSelectedWithdrawal(withdrawal);
    setAction(actionType);
    setTxHash('');
    setAdminNote('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedWithdrawal) return;

    setProcessingId(selectedWithdrawal._id);

    try {
      await api.put(`/admin/withdrawals/${selectedWithdrawal._id}`, {
        status: action,
        txHash: action === 'sent' ? txHash : undefined,
        adminNote,
      });
      toast.success(`Withdrawal marked as ${action}`);
      setShowModal(false);
      fetchWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1 className="page-title">Manage Withdrawals</h1>

        <div className="card">
          {withdrawals.length === 0 ? (
            <div className="empty-state">No pending withdrawals</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Wallet Address</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((wd) => (
                  <tr key={wd._id}>
                    <td>
                      {wd.userId?.name}
                      <br />
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {wd.userId?.email}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600', color: '#ef4444' }}>
                      {wd.amount.toFixed(2)} USDT
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                      }}
                      title={wd.walletAddress}
                    >
                      {wd.walletAddress}
                    </td>
                    <td>{new Date(wd.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleAction(wd, 'sent')}
                          disabled={processingId === wd._id}
                        >
                          Mark Sent
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(wd, 'rejected')}
                          disabled={processingId === wd._id}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>
              {action === 'sent' ? 'Process Withdrawal' : 'Reject Withdrawal'}
            </h3>
            <p style={{ marginBottom: '16px', color: '#94a3b8' }}>
              Amount:{' '}
              <strong style={{ color: '#e2e8f0' }}>
                {selectedWithdrawal?.amount.toFixed(2)} USDT
              </strong>
            </p>
            <p style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '13px' }}>
              To: {selectedWithdrawal?.walletAddress}
            </p>

            {action === 'sent' && (
              <div className="form-group">
                <label>Transaction Hash (optional)</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter blockchain TX hash"
                />
              </div>
            )}

            <div className="form-group">
              <label>Admin Note (optional)</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                className={`btn ${action === 'sent' ? 'btn-success' : 'btn-danger'}`}
                style={{ flex: 1 }}
                onClick={confirmAction}
                disabled={processingId === selectedWithdrawal?._id}
              >
                {processingId === selectedWithdrawal?._id
                  ? 'Processing...'
                  : action === 'sent'
                  ? 'Confirm Sent'
                  : 'Confirm Rejection'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWithdrawals;