import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css'; 

const Footer = () => {
  return (
    <footer className={styles.mainFooter}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <p>&copy; 2025 NgopiYuk!. All Rights Reserved.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link to="/bantuan">Bantuan</Link>
          <Link to="/tentang">Tentang</Link>
          <Link to="/hubungi">Hubungi Kami</Link>
        </div>
        <div className={styles.footerSocial}>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;