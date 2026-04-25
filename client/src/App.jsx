import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';
import Register from './pages/auth/Register.jsx';

// User Pages
import UserDashboard from './pages/user/Dashboard.jsx';
import Deposit from './pages/user/Deposit.jsx';
import Convert from './pages/user/Convert.jsx';
import Withdraw from './pages/user/Withdraw.jsx';
import Transactions from './pages/user/Transactions.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import ManageDeposits from './pages/admin/ManageDeposits.jsx';
import ManageWithdrawals from './pages/admin/ManageWithdrewals.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import SetRate from './pages/admin/SetRate.jsx';

/**
 * App - Main Application Component
 * Defines all routes with role-based protection
 */
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <UserProtectedRoute>
              <Deposit />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/convert"
          element={
            <UserProtectedRoute>
              <Convert />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <UserProtectedRoute>
              <Withdraw />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <UserProtectedRoute>
              <Transactions />
            </UserProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/deposits"
          element={
            <AdminProtectedRoute>
              <ManageDeposits />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/withdrawals"
          element={
            <AdminProtectedRoute>
              <ManageWithdrawals />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rate"
          element={
            <AdminProtectedRoute>
              <SetRate />
            </AdminProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;