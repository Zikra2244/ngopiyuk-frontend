import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute'; // 1. Impor komponen yang dibutuhkan
import ProfilePage from '../../components/UserProfile/ProfilePage';    // 2. Impor halaman yang akan ditampilkan

const ProfileRoute = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

export default ProfileRoute;