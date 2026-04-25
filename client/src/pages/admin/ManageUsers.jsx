import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';

/**
 * ManageUsers - Admin User Management
 * Lists all users with their wallet balances
 */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1 className="page-title">Manage Users</h1>

        <div className="card">
          {users.length === 0 ? (
            <div className="empty-state">No users found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>USD Balance</th>
                  <th>USDT Balance</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td style={{ color: '#10b981', fontWeight: '600' }}>
                      ${user.wallet?.balanceUSD?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ color: '#3b82f6', fontWeight: '600' }}>
                      {user.wallet?.balanceUSDT?.toFixed(2) || '0.00'}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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

export default ManageUsers;