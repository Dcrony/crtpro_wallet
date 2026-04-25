import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig.js';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Login - User Login Page
 * Only allows users with role === "user"
 * Redirects admins to admin login page
 */
const Login = () => {
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

      // CRITICAL: Check if user role is admin
      // If admin tries to login on user page, redirect to admin login
      if (user.role === 'admin') {
        toast.error('Admins must use the admin login page');
        navigate('/admin/login');
        return;
      }

      // Regular user login successful
      login(token, user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>👤 User Login</h1>
        <p className="subtitle">Access your wallet dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="switch-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <div className="switch-link">
          Are you an admin? <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;