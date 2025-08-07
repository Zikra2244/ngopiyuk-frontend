// frontend/src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} NgopiYuk. Dibuat oleh Kelompok 5.</p>
    </footer>
  );
};

export default Footer;