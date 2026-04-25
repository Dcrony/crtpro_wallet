import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * AdminNavbar - Navigation for admin panel
 */
const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/admin/dashboard" className="navbar-brand">
          🛡️ Admin Panel
        </Link>
        <div className="navbar-links">
          <Link
            to="/admin/dashboard"
            className={isActive('/admin/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/deposits"
            className={isActive('/admin/deposits') ? 'active' : ''}
          >
            Deposits
          </Link>
          <Link
            to="/admin/withdrawals"
            className={isActive('/admin/withdrawals') ? 'active' : ''}
          >
            Withdrawals
          </Link>
          <Link
            to="/admin/users"
            className={isActive('/admin/users') ? 'active' : ''}
          >
            Users
          </Link>
          <Link
            to="/admin/rate"
            className={isActive('/admin/rate') ? 'active' : ''}
          >
            Rate
          </Link>
          <span style={{ color: '#64748b' }}>
            {user?.name} <span className="admin-badge">ADMIN</span>
          </span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;