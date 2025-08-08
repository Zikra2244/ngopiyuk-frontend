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
          <Link to="/help">Help</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
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