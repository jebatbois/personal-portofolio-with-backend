// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Jika tidak ada token, tendang ke halaman login
    return <Navigate to="/admin/login" />;
  }

  // Jika ada token, tampilkan halaman yang seharusnya
  return children;
};

export default ProtectedRoute;