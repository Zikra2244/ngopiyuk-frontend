import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Header.module.css";
import api, { API_URL } from "@/services/api";
import { getImageUrl } from "@/utils/imageUrl";

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Untuk mendeteksi klik di luar

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get(`/users/profile`, {});
          setUser(response.data);
        } catch (error) {
          console.error("Gagal mengambil profil di header:", error);
          localStorage.removeItem("token");
        }
      }
    };
    fetchUserProfile();
  }, []);

  // Efek untuk menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropdownVisible(false);
    navigate("/");
  };
  //  console.log("DEBUG: Data user di Header:", user);
  return (
    <header className={styles.mainHeader}>
      {/* BAGIAN LOGO ANDA YANG SEBELUMNYA HILANG, SEKARANG SUDAH KEMBALI */}
      <div className={styles.logo}>
        <Link to={user ? "/home" : "/"}>
          <i className={`fas fa-mug-hot ${styles.logoIcon}`}></i>
          JAWA JAWA JAWA ANJEENG
        </Link>
      </div>

      {/* BAGIAN NAVIGASI DENGAN DROPDOWN YANG SUDAH DIPERBAIKI */}
      <nav className={styles.mainNav}>
        {user && user.username ? (
          <div className={styles.userMenuWrapper} ref={dropdownRef}>
            <div
              className={styles.userMenu}
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              {user.avatar && user.avatar !== "default-avatar.jpg" ? (
                <img
                  src={getImageUrl(user.avatar, user.id)}
                  alt="Avatar"
                  className={styles.headerAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImageUrl(null, user.id);
                  }}
                />
              ) : (
                <div className={styles.profileInitial}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{user.username}</span>
              <i
                className={`fas fa-chevron-down ${styles.arrowDown} ${
                  dropdownVisible ? styles.arrowUp : ""
                }`}
              ></i>
            </div>

            {dropdownVisible && (
              <div className={styles.dropdownMenu}>
                <Link to="/">Beranda</Link>
                {user.role === "user" && (
                  <Link to="/profile">Lihat Profil</Link>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className={`${styles.btn} ${styles.btnNavSecondary}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${styles.btn} ${styles.btnNavPrimary}`}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
