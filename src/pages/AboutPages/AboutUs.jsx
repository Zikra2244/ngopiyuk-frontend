import React, { useState, useEffect } from 'react'; // 1. Impor useState dan useEffect
import { Link } from 'react-router-dom';
import styles from './AboutUs.module.css';

// 1. Impor Header dan Footer
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Impor gambar-gambar yang dibutuhkan
import aboutMain from '../../assets/about-main.jpg';
import aboutSub1 from '../../assets/about-sub1.jpeg';
import aboutSub2 from '../../assets/about-sub2.jpeg';

const AboutUs = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // [] berarti efek ini hanya berjalan sekali saat komponen dimuat

  return (
    <>
      <Header />

      {/* 2. Bungkus semua konten dengan div baru untuk background */}
      <div className={styles.aboutPage}>
        <main className={styles.pageWrapper}>

           <Link to="/" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </Link>

          <section className={styles.imageGrid}>
            <div className={styles.mainImageContainer}>
              <img src={aboutMain} alt="Suasana event NgopiYuk" />
            </div>
            <div className={styles.subImageContainer}>
              <img src={aboutSub1} alt="Peserta workshop" />
              <img src={aboutSub2} alt="Ruang seminar" />
            </div>
          </section>

          <section className={styles.mainContent}>
            
            {/* Sidebar Biru */}
            <aside className={styles.sidebar}>
              <h3>Yuk! Tumbuh Bersama</h3>
              <p>NgopiYuk! percaya kopi selalu lebih nikmat kalau dibagi bareng. Ayo jadi bagian dari perjalanan ini!</p>
              <ul>
                <li><span>Ingin berkolaborasi?</span><a href="#">Jadi Partner Kami</a></li>
                <li><span>Punya rekomendasi tempat ngopi?</span>
                  <Link to={isLoggedIn ? '/home' : '/login'}>
                    Bagikan Ceritamu!
                  </Link></li>
              </ul>
            </aside>

            {/* Teks Utama */}
            <main className={styles.contentArea}>
              <h1 className={styles.mainTitle}>Ngopi dengan Cara yang Lebih Personal</h1>
              <p className={styles.paragraph}>
                NgopiYuk! hadir untuk membantu pecinta kopi menemukan coffeeshop terbaik di berbagai kota di Indonesia. Kami percaya setiap orang punya selera dan pengalaman unik saat menikmati kopi—mulai dari jenis biji, cita rasa, hingga suasana tempat yang membuat nyaman.
                Melalui platform ini, kami ingin memudahkan siapa saja untuk menemukan coffeeshop yang sesuai dengan preferensi masing-masing. Tidak hanya sekadar rekomendasi, NgopiYuk! juga menjadi ruang untuk berbagi pengalaman, ulasan, dan inspirasi seputar dunia kopi.
              </p>

              <div className={styles.subSection}>
                <div className={styles.subSectionHeader}>
                  <h2>Apa yang bisa kamu temukan di NgopiYuk?</h2>
                </div>
                <ul className={styles.list}>
                  <li>🎯 Rekomendasi coffeeshop sesuai selera rasa dan suasana yang kamu cari.</li>
                  <li>📝 Ulasan nyata dari para penikmat kopi.</li>
                  <li>🌍 Panduan untuk menjelajahi kota lewat budaya kopinya.</li>
                  <li>💛 Dukungan untuk kedai kopi lokal agar semakin dikenal dan berkembang.</li>
                </ul>
              </div>
              
            </main>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;