import React from 'react';
import styles from './AboutUs.module.css'; // File CSS terpisah
import aboutUsImage from '../../assets/about-us-1.jpeg'; // Pastikan path ini benar

// Data untuk "Core Values" agar lebih rapi
const values = [
  { icon: '☕', title: 'Quality Beans', desc: 'Directly sourced from local farmers' },
  { icon: '❤️', title: 'Community', desc: 'Supporting local coffee growers' },
  { icon: '🌱', title: 'Sustainability', desc: 'Eco-friendly practices' },
];

const AboutUs = () => {
  return (
    <div className={styles.pageWrapper}>
      
      {/* BAGIAN 1: PERKENALAN & CERITA KAMI */}
      <section className={styles.introSection}>
        <div className={styles.introContent}>
          <div className={styles.introText}>
            <h1 className={styles.mainTitle}>Tentang NgopiYuk!</h1>
            <p>
              Didirikan di sebuah garasi kecil di Jakarta, NGOPIYUK dimulai dengan misi sederhana: 
              membawa kopi berkualitas tinggi untuk semua orang. Apa yang berawal dari proyek 
              kecil antara tiga penggemar kopi kini telah berkembang menjadi tempat favorit 
              bagi komunitas lokal.
            </p>
          </div>
          <div className={styles.introImageContainer}>
            <img src={aboutUsImage} alt="Suasana kedai kopi NgopiYuk" className={styles.introImage} />
          </div>
        </div>
      </section>

      {/* BAGIAN 2: NILAI-NILAI KAMI */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Nilai Utama Kami</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>
              <span className={styles.valueIcon}>{value.icon}</span>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDesc}>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutUs;