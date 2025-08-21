import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Rating } from 'react-simple-star-rating';

const ProfilePage = () => {
  // State untuk data user dan status UI
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [activeTab, setActiveTab] = useState('collection'); // State untuk tab aktif
  const navigate = useNavigate();

  // 1. Mengambil data profil dari backend saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        navigate('/login');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === 'admin') {
          alert("Admin tidak memiliki halaman profil.");
          navigate('/admin/dashboard');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: 'Bearer ' + token }
        });
        setUserData(response.data);
        setTempUsername(response.data.username);
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // 2. Fungsi untuk update username ke backend
  const handleUpdateUsername = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { username: tempUsername, email: userData.email },
        { headers: { Authorization: 'Bearer ' + token } }
      );
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
      formData.append('avatar', file);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put(
          'http://localhost:5000/api/users/profile/avatar',
          formData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
        setUserData(prev => ({ ...prev, avatar: response.data.avatar }));
        alert('Foto profil berhasil diperbarui!');
      } catch (error) {
        console.error("Gagal update avatar:", error);
        alert("Gagal update avatar.");
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>Loading profile...</div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>Gagal memuat profil. Silakan coba login kembali.</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.profilePageContainer}>
        <main className={styles.profileContent}>

          {/* KARTU 1: HEADER PROFIL (Tidak berubah) */}
          <div className={styles.profileHeaderCard}>
            <div className={styles.avatarContainer}>
              <img 
                src={`http://localhost:5000/${userData.avatar}`} 
                alt="Foto Profil" 
                className={styles.profileAvatar} 
                onError={(e) => { e.target.onerror = null; e.target.src="/default-avatar.jpg" }}
              />
              <button className={styles.changeAvatarBtn} onClick={() => document.getElementById('avatarInput').click()}>
                <i className="fas fa-camera"></i>
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
                    setTempUsername(userData.username);
                    setIsEditing(true);
                  }}>
                    <i className="fas fa-edit"></i> Edit Username
                  </button>
                </>
              )}
              <p className={styles.userEmail}>{userData.email}</p>
            </div>
          </div>
          
          {/* BAGIAN ULASAN PENGGUNA (BARU) */}
          <div className={styles.reviewSection}>
            <h2 className={styles.sectionTitle}>Your Review</h2>
            
            <div className={styles.totalReviewsCard}>
              <div className={styles.totalReviewsIcon}>
                <i className="fas fa-comment-alt"></i>
              </div>
              <div className={styles.totalReviewsText}>
                <div className={styles.totalReviewsNumber}>{userData.reviewsCount}</div>
                <div className={styles.totalReviewsLabel}>Total Review</div>
              </div>
            </div>

            <div className={styles.tabNav}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'collection' ? styles.active : ''}`}
                onClick={() => setActiveTab('collection')}
              >
                Koleksi Review mu
              </button>
            </div>

            <div className={styles.reviewsList}>
              {activeTab === 'collection' && (
                <>
                  {userData.reviews && userData.reviews.length > 0 ? (
                      userData.reviews.map(review => {
                        const date = new Date(review.createdAt);
                        const formattedDate = !isNaN(date) 
                          ? date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                          : 'Tanggal tidak valid';
                        
                        return (
                          <div key={review.id} className={styles.reviewItem}>
                              <div className={styles.reviewIcon}>
                                <i className="fas fa-mug-hot"></i>
                              </div>
                              <div className={styles.reviewDetails}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewCafeName}>{review.Cafe.name}</span>
                                    <span className={styles.reviewDate}>{formattedDate}</span>
                                </div>
                                <Rating 
                                    initialValue={review.rating} 
                                    readonly 
                                    size={22} 
                                    fillColor="var(--primary-color)"
                                    emptyColor="#d1d1d1"
                                />
                                <p className={styles.reviewTitle}>"{review.title}"</p>
                                <p className={styles.reviewDescription}>{review.description}</p>
                              </div>
                          </div>
                        );
                      })
                  ) : (
                      <p className={styles.emptyState}>Anda belum menulis ulasan.</p>
                  )}
                </>
              )}
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;