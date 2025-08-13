import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute'; // 1. Impor komponen yang dibutuhkan
import ProfilePage from '../../components/UserProfile/ProfilePage';    // 2. Impor halaman yang akan ditampilkan

// 3. Buat SATU komponen utama untuk file ini
const ProfileRoute = () => {
  return (
    // 4. GUNAKAN komponen ProtectedRoute yang sudah diimpor
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

// 5. Ekspor komponen utama dari file ini
export default ProfileRoute;