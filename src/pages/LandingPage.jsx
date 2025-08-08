import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className={styles.landingPageLight}>
      <Header />

      <main className={styles.heroSection}>
        <div className={styles.heroContent}>
            <h1>Setiap Sudut Kota Punya Cerita Kopinya.</h1>
            <p>
                Platform untuk menemukan, mengulas, dan berbagi kedai kopi favorit.
                Mulai petualangan kafein Anda bersama kami.
            </p>
            <div className={styles.heroButtons}>
                {/* 4. Buat link tombol menjadi dinamis */}
                <Link to={isLoggedIn ? '/home' : '/register'} className={`${styles.btnHero} ${styles.primary}`}>
                    <span>Mulai Menjelajah</span>
                </Link>
            </div>
        </div>
      </main>
      
      <section id="features" className={styles.featureSection}>
        <div className={styles.sectionHeader}>
          <h2>Semua yang Anda Butuhkan</h2>
        </div>
        <div className={styles.featureCardsContainer}>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}><i className="fas fa-map-marked-alt"></i></div>
            <h3>Peta Interaktif</h3>
            <p>Temukan kedai kopi terdekat dengan mudah melalui peta yang responsif.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}><i className="fas fa-star"></i></div>
            <h3>Ulasan Komunitas</h3>
            <p>Lihat rating dan ulasan jujur dari para pencinta kopi lainnya.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}><i className="fas fa-book-open"></i></div>
            <h3>Jurnal Kopi Pribadi</h3>
            <p>Simpan daftar kedai kopi yang ingin atau sudah Anda kunjungi.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;