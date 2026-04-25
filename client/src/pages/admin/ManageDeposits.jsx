import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';

/**
 * ManageDeposits - Admin Deposit Approval
 * Lists pending deposits with approve/reject actions
 */
const ManageDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [action, setAction] = useState('');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await api.get('/admin/deposits');
      setDeposits(res.data.deposits);
    } catch (error) {
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (deposit, actionType) => {
    setSelectedDeposit(deposit);
    setAction(actionType);
    setAdminNote('');
    setShowNoteModal(true);
  };

  const confirmAction = async () => {
    if (!selectedDeposit) return;

    setProcessingId(selectedDeposit._id);

    try {
      await api.put(`/admin/deposits/${selectedDeposit._id}`, {
        status: action,
        adminNote,
      });
      toast.success(`Deposit ${action} successfully`);
      setShowNoteModal(false);
      fetchDeposits();
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
        <h1 className="page-title">Manage Deposits</h1>

        <div className="card">
          {deposits.length === 0 ? (
            <div className="empty-state">No pending deposits</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit._id}>
                    <td>{deposit.userId?.name || 'Unknown'}</td>
                    <td>{deposit.userId?.email || 'Unknown'}</td>
                    <td style={{ fontWeight: '600', color: '#10b981' }}>
                      ${deposit.amount.toFixed(2)}
                    </td>
                    <td>{new Date(deposit.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleAction(deposit, 'approved')}
                          disabled={processingId === deposit._id}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleAction(deposit, 'rejected')}
                          disabled={processingId === deposit._id}
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

      {/* Note Modal */}
      {showNoteModal && (
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
              {action === 'approved' ? 'Approve' : 'Reject'} Deposit
            </h3>
            <p style={{ marginBottom: '16px', color: '#94a3b8' }}>
              Amount:{' '}
              <strong style={{ color: '#e2e8f0' }}>
                ${selectedDeposit?.amount.toFixed(2)}
              </strong>
            </p>
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
                className={`btn ${action === 'approved' ? 'btn-success' : 'btn-danger'}`}
                style={{ flex: 1 }}
                onClick={confirmAction}
                disabled={processingId === selectedDeposit?._id}
              >
                {processingId === selectedDeposit?._id
                  ? 'Processing...'
                  : `Confirm ${action === 'approved' ? 'Approval' : 'Rejection'}`}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowNoteModal(false)}
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

export default ManageDeposits;