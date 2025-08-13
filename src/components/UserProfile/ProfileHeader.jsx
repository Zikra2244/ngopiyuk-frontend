import React, { useState } from 'react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ username, email, avatar, onUpdateUsername, onUpdateAvatar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateAvatar(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveUsername = () => {
    onUpdateUsername(tempUsername);
    setIsEditing(false);
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarContainer}>
        <img src={avatar} alt="Foto Profil" className={styles.profileAvatar} />
        <button 
          className={styles.changeAvatarBtn}
          onClick={() => document.getElementById('avatarInput').click()}
        >
          <i className="fas fa-camera"></i> Ganti Foto
        </button>
        <input 
          type="file" 
          id="avatarInput" 
          accept="image/*" 
          onChange={handleAvatarChange}
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
            <button className={styles.saveBtn} onClick={handleSaveUsername}>
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
            <h1 className={styles.username}>{username}</h1>
            <button 
              className={styles.editUsernameBtn} 
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i> Edit Username
            </button>
          </>
        )}
        <p className={styles.userEmail}>{email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;