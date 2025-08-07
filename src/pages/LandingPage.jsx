// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // CSS khusus untuk landing page

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Selamat Datang di NgopiYuk! ☕</h1>
        <p>Temukan dan bagikan tempat ngopi favoritmu di seluruh penjuru.</p>
        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;