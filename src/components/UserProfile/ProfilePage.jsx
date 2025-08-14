import React, { useState } from 'react';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  // State untuk data user
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [userData, setUserData] = useState({
    username: 'Username',
    email: 'user@example.com',
    avatar: '/default-avatar.jpg',
    reviewsCount: 12,
    favoritesCount: 5,
    favoriteCafes: []
  });


  // Fungsi untuk update avatar
  const updateAvatar = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData(prev => ({
          ...prev,
          avatar: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const updateUsername = () => {
    setUserData(prev => ({ ...prev, username: tempUsername }));
    setIsEditing(false); // Keluar dari mode edit setelah menyimpan
  };

  return (
    <div className={styles.profilePage}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <img 
            src={userData.avatar} 
            alt="Foto Profil" 
            className={styles.profileAvatar} 
          />
          <button 
            className={styles.changeAvatarBtn}
            onClick={() => document.getElementById('avatarInput').click()}
          >
            <span className={styles.btnIcon}>📷</span> Ganti Foto
          </button>
          <input 
            type="file" 
            id="avatarInput" 
            accept="image/*" 
            onChange={updateAvatar}
            style={{ display: 'none' }} 
          />
        </div>
        
        <div className={styles.profileInfo}>
          {isEditing ? (
            <div className={styles.usernameEditForm}>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className={styles.usernameInput}
              />
              <button className={styles.saveBtn} onClick={updateUsername}>
                Simpan
              </button>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setIsEditing(false)}
              >
                Batal
              </button>
            </div>
          ) : (
            <>
              <h1 className={styles.username}>{userData.username}</h1>
              <button 
                className={styles.editUsernameBtn} 
                onClick={() => {
                  setTempUsername(userData.username);
                  setIsEditing(true);
                }}
              >
                <span className={styles.btnIcon}>✏️</span> Edit Username
              </button>
            </>
          )}
          <p className={styles.userEmail}>{userData.email}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Activity Stats */}
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

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Favorite Cafes */}
      <div className={styles.favoriteCafes}>
        <h2>Kafe Favorit Saya</h2>
        <div className={styles.cafesList}>
          {userData.favoriteCafes.length > 0 ? (
            <ul className={styles.cafeList}>
              {userData.favoriteCafes.map((cafe, index) => (
                <li key={index} className={styles.cafeItem}>
                  {cafe.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyState}>Belum ada kafe favorit yang disimpan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;