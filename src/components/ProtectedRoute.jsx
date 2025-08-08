// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Jika tidak ada token, arahkan kembali ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika ada token, tampilkan komponen anaknya (misalnya HomePage)
  return children;
};

export default ProtectedRoute;