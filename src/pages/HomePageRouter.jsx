// frontend/src/pages/HomePageRouter.jsx
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminHomePage from './AdminPages/HomePage';
import UserHomePage from './UserPages/HomePage';

const HomePageRouter = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Seharusnya tidak terjadi karena ada ProtectedRoute, tapi sebagai penjaga
    return null;
  }

  try {
    const decodedUser = jwtDecode(token);
    // Cek peran user dari token dan tampilkan halaman yang sesuai
    if (decodedUser.role === 'admin') {
      return <AdminHomePage />;
    } else {
      return <UserHomePage />;
    }
  } catch (error) {
    console.error("Token tidak valid:", error);
    // Mungkin arahkan ke halaman login jika token rusak
    return null;
  }
};

export default HomePageRouter;