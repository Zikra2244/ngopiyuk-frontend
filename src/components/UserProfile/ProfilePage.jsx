import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import Header from '../Header'; // Pastikan Header diimpor untuk navigasi

const ProfilePage = () => {
  // State untuk data user dan status UI
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  // 1. Mengambil data profil dari backend saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return; 
      }
      
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setUserData(response.data);
        setTempUsername(response.data.username); // Inisialisasi tempUsername
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Fungsi untuk update username ke backend
  const handleUpdateUsername = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { username: tempUsername, email: userData.email },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      // Perbarui state dengan data terbaru dari server dan beri notifikasi
      setUserData(prev => ({ ...prev, username: response.data.username }));
      setIsEditing(false);
      alert('Username berhasil diperbarui!');
    } catch (error) {
      console.error("Gagal update username:", error);
      alert("Gagal update username.");
    }
  };

  // 3. Fungsi untuk update avatar ke backend
  const handleUpdateAvatar = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('avatar', file); // 'avatar' harus cocok dengan nama field di backend
      const token = localStorage.getItem('token');

      try {
        const response = await axios.put(
          'http://localhost:5000/api/users/profile/avatar',
          formData,
          { 
            headers: { 
              Authorization: 'Bearer ' + token,
              // 'Content-Type': 'multipart/form-data' tidak perlu diatur manual, Axios melakukannya otomatis untuk FormData
            } 
          }
        );
        // Perbarui state dengan path avatar baru dari server dan beri notifikasi
        setUserData(prev => ({ ...prev, avatar: response.data.avatar }));
        alert('Foto profil berhasil diperbarui!');
      } catch (error) {
        console.error("Gagal update avatar:", error);
        alert("Gagal update avatar.");
      }
    }
  };
  
  // Tampilan saat data sedang dimuat
  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>Loading profile...</div>
      </>
    );
  }
  
  // Tampilan jika gagal memuat atau tidak ada data
  if (!userData) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>Gagal memuat profil. Silakan coba login kembali.</div>
      </>
    );
  }

  // Tampilan utama setelah data berhasil didapat
  return (
    <>
      <Header />
      <div className={styles.profilePageContainer}>
        <div className={styles.profilePage}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <img 
                // Arahkan src ke URL backend untuk menampilkan gambar
                src={`http://localhost:5000/${userData.avatar}`} 
                alt="Foto Profil" 
                className={styles.profileAvatar} 
                onError={(e) => { e.target.onerror = null; e.target.src="/default-avatar.jpg" }} // Fallback jika gambar gagal dimuat
              />
              <button className={styles.changeAvatarBtn} onClick={() => document.getElementById('avatarInput').click()}>
                <span className={styles.btnIcon}>📷</span> Ganti Foto
              </button>
              <input type="file" id="avatarInput" accept="image/*" onChange={handleUpdateAvatar} style={{ display: 'none' }} />
            </div>
            
            <div className={styles.profileInfo}>
              {isEditing ? (
                <div className={styles.usernameEditForm}>
                  <input type="text" value={tempUsername} onChange={(e) => setTempUsername(e.target.value)} className={styles.usernameInput} />
                  <button className={styles.saveBtn} onClick={handleUpdateUsername}>Simpan</button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Batal</button>
                </div>
              ) : (
                <>
                  <h1 className={styles.username}>{userData.username}</h1>
                  <button className={styles.editUsernameBtn} onClick={() => {
                      setTempUsername(userData.username); // Reset tempUsername saat tombol edit diklik
                      setIsEditing(true);
                    }}>
                    <span className={styles.btnIcon}>✏️</span> Edit Username
                  </button>
                </>
              )}
              <p className={styles.userEmail}>{userData.email}</p>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.activityStats}>
            <h2>Statistik Aktivitas</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{userData.reviewsCount}</div>
                <div className={styles.statLabel}>Ulasan Ditulis</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{userData.favoritesCount}</div>
                <div className={styles.statLabel}>Kafe Difavoritkan</div>
              </div>
            </div>
          </div>
          
          {/* Anda bisa kembangkan bagian ini lebih lanjut dengan menampilkan daftar ulasan */}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;