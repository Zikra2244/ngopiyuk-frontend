import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Header.module.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                console.error("Token tidak valid:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setDropdownVisible(false);
        navigate('/'); // Arahkan ke landing page setelah logout
    };

    return (
        <header className={styles.mainHeader}>
            <div className={styles.logo}>
                {/* Jika sudah login, logo mengarah ke /home, jika belum ke / */}
                <Link to={user ? "/home" : "/"}>
                    <i className={`fas fa-mug-hot ${styles.logoIcon}`}></i>
                    NgopiYuk!
                </Link>
            </div>
            <nav className={styles.mainNav}>
                {user && user.username ? ( // Pastikan user dan username ada
                    // Tampilan jika sudah login
                    <div className={styles.userMenuWrapper}>
                        <div className={styles.userMenu} onClick={() => setDropdownVisible(!dropdownVisible)}>
                            {/* --- PERUBAHAN DI SINI --- */}
                            <div className={styles.profileInitial}>{user.username.charAt(0).toUpperCase()}</div>
                            <span>{user.username}</span>
                            <i className={`fas fa-chevron-down ${styles.arrowDown} ${dropdownVisible ? styles.arrowUp : ''}`}></i>
                        </div>
                        {dropdownVisible && (
                            <div className={styles.dropdownMenu}>
                                <Link to="/">Home</Link>
                                <Link to="/profile">Lihat Profil</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Tampilan jika belum login (di landing page)
                    <>
                        <Link to="/login" className={`${styles.btn} ${styles.btnNavSecondary}`}>Login</Link>
                        <Link to="/register" className={`${styles.btn} ${styles.btnNavPrimary}`}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;