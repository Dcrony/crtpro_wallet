import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig.js';

// Create auth context
const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state globally
 * Provides user data, login, logout, and role checking
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Login user - stores token and user data
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Logout user - clears all auth data
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Check if current user is admin
   */
  const isAdmin = () => user?.role === 'admin';

  /**
   * Check if current user is regular user
   */
  const isUser = () => user?.role === 'user';

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin, isUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;