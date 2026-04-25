import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Navbar - Navigation for regular users
 * Shows wallet links and logout
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          💰 CryptoWallet
        </Link>
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={isActive('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/deposit"
            className={isActive('/deposit') ? 'active' : ''}
          >
            Deposit
          </Link>
          <Link
            to="/convert"
            className={isActive('/convert') ? 'active' : ''}
          >
            Convert
          </Link>
          <Link
            to="/withdraw"
            className={isActive('/withdraw') ? 'active' : ''}
          >
            Withdraw
          </Link>
          <Link
            to="/transactions"
            className={isActive('/transactions') ? 'active' : ''}
          >
            History
          </Link>
          <span style={{ color: '#64748b' }}>{user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;