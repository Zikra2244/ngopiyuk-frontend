import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

const useScrollAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target); // Hentikan observasi setelah animasi berjalan
          }
        });
      },
      {
        threshold: 0.1, // Animasi berjalan saat 10% elemen terlihat
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return ref;
};

const LandingPage = () => {
  const featuresRef = useScrollAnimation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
            Di setiap sudut kota selalu ada cerita yang lahir dari secangkir
            kopi. NgopiYuk hadir untuk menemani perjalananmu menemukan kedai
            kopi dengan rasa, suasana, dan pengalaman yang paling sesuai
            untukmu.
          </p>
          <div className={styles.heroButtons}>
            <Link
              to={isLoggedIn ? "/home" : "/register"}
              className={`${styles.btnHero} ${styles.primary}`}
            >
              <span>Raip memek</span>
            </Link>
          </div>
        </div>
      </main>

      <section
        ref={featuresRef}
        id="features"
        className={`${styles.featureSection} ${styles.hidden}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Semua yang Anda Butuhkan</h2>
        </div>
        <div className={styles.featureCardsContainer}>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h3>Peta Interaktif</h3>
            <p>
              Temukan kedai kopi terdekat dengan mudah melalui peta yang
              responsif.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <i className="fas fa-star"></i>
            </div>
            <h3>Ulasan Komunitas</h3>
            <p>
              Lihat rating dan ulasan jujur dari para pencinta kopi lainnya.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>
              <i className="fas fa-book-open"></i>
            </div>
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
