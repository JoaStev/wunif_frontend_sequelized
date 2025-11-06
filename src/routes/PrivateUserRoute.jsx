import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateUserRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Only allow non-admin users
  if (user.role === 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
