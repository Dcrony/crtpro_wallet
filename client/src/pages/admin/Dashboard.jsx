import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';

/**
 * AdminDashboard - Admin Overview
 * Shows key metrics and quick links
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="value">{stats?.totalUsers || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Pending Deposits</h3>
            <div className="value" style={{ color: '#f59e0b' }}>
              {stats?.pendingDeposits || 0}
            </div>
          </div>
          <div className="stat-card">
            <h3>Pending Withdrawals</h3>
            <div className="value" style={{ color: '#ef4444' }}>
              {stats?.pendingWithdrawals || 0}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <div className="value">{stats?.totalTransactions || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total USD in System</h3>
            <div className="value" style={{ color: '#10b981' }}>
              ${stats?.totalUSDBalance?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total USDT in System</h3>
            <div className="value" style={{ color: '#3b82f6' }}>
              {stats?.totalUSDTBalance?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#94a3b8' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/admin/deposits" className="btn btn-success">
              Manage Deposits
            </Link>
            <Link to="/admin/withdrawals" className="btn btn-danger">
              Manage Withdrawals
            </Link>
            <Link to="/admin/users" className="btn btn-primary">
              View Users
            </Link>
            <Link to="/admin/rate" className="btn btn-secondary">
              Set Rate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;