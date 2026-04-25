import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * UserProtectedRoute - Only allows access to regular users
 * Redirects to /login if not authenticated or not a user
 */
export const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'user') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/**
 * AdminProtectedRoute - Only allows access to admins
 * Redirects to /admin/login if not authenticated or not admin
 */
export const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default { UserProtectedRoute, AdminProtectedRoute };