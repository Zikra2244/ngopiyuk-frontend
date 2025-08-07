// frontend/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Header.css'; // Kita akan buat file CSS ini

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    }
  }, []);

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('token');
    // Arahkan kembali ke landing page
    navigate('/');
  };

  if (!user) {
    return null; // Jangan tampilkan header jika user belum teridentifikasi
  }

  return (
    <header className="app-header">
      <div className="header-logo">
        NgopiYuk! ☕
      </div>
      <div className="header-profile" onClick={() => setDropdownVisible(!dropdownVisible)}>
        <div className="profile-initial">{user.email.charAt(0).toUpperCase()}</div>
        <span>{user.email}</span>
        <i className="arrow-down"></i>

        {dropdownVisible && (
          <div className="dropdown-menu">
            <a href="#profile">Lihat Profil</a>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;