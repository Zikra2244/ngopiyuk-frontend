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
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setDropdownVisible(false);
        navigate('/'); // <-- PERUBAHAN DI SINI
    };

    return (
        <header className={styles.mainHeader}>
            <div className={styles.logo}>
                <Link to="/"> 
                    <i className={`fas fa-mug-hot ${styles.logoIcon}`}></i> 
                    NgopiYuk!
                </Link>
            </div>
            <nav className={styles.mainNav}>
                {user ? (
                    // TAMPILAN JIKA SUDAH LOGIN
                    <div className={styles.userMenu} onClick={() => setDropdownVisible(!dropdownVisible)}>
                        <div className={styles.profileInitial}>{user.email.charAt(0).toUpperCase()}</div>
                        <span>{user.email}</span>
                        <i className={`fas fa-chevron-down ${styles.arrowDown} ${dropdownVisible ? styles.arrowUp : ''}`}></i>

                        {dropdownVisible && (
                            <div className={styles.dropdownMenu}>
                                <Link to="/profile">Lihat Profil</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    // TAMPILAN JIKA BELUM LOGIN
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