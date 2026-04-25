import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * AdminLogin - Admin Login Page
 * Only allows users with role === "admin"
 * Shows "Access denied" for regular users
 */
const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      const { token, user } = res.data;

      // CRITICAL: Check if user role is NOT admin
      // If regular user tries to login on admin page, deny access
      if (user.role !== 'admin') {
        toast.error('Access denied. Admins only.');
        setLoading(false);
        return; // Do not login, do not redirect
      }

      // Admin login successful
      login(token, user);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🛡️ Admin Login</h1>
        <p className="subtitle">Restricted access - Admins only</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Admin password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="switch-link">
          Not an admin? <Link to="/login">User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;