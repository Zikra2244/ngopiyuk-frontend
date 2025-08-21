import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ContactPage.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import contactInfoImage from '../../assets/contact-info.jpg';

const ContactPage = () => {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert("Terima kasih! Pesan Anda telah terkirim.");
        e.target.reset();
    };

    return (
        <>
            <Header />
            <div className={styles.contactPage}>

                {/* --- HERO SECTION --- */}
                <section className={styles.heroSection}>
                    <Link to="/" className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.heroContent}>
                        <h1>Hubungi Kami</h1>
                        <p>Punya pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengarkan.</p>
                    </div>
                </section>

                {/* --- BAGIAN INFORMASI & GAMBAR --- */}
                <section className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        <div className={styles.infoText}>
                            <span className={styles.subheading}>KONTAK</span>
                            <h2>Get in Touch</h2>
                            <p>
                                Kami selalu senang mendengar dari komunitas kami. Baik itu rekomendasi tempat kopi baru,
                                peluang kemitraan, atau sekadar menyapa, tim kami siap membantu Anda.
                            </p>
                            <ul className={styles.contactDetails}>
                                <li><i className="fas fa-map-marker-alt"></i><span>Jakarta, Indonesia</span></li>
                                <li><i className="fas fa-phone-alt"></i><span>(+62) 812 3456 7890</span></li>
                                <li><i className="fas fa-envelope"></i><span>kontak@ngopiyuk.id</span></li>
                            </ul>
                        </div>
                        <div className={styles.infoImage}>
                            <img src={contactInfoImage} alt="Interior kedai kopi" />
                        </div>
                    </div>
                </section>

                {/* --- BAGIAN FORMULIR & JAM OPERASIONAL --- */}
                <section className={styles.formSection}>
                    <div className={styles.formContent}>
                        <div className={styles.formContainer}>
                            <form onSubmit={handleFormSubmit}>
                                <div className={styles.formRow}>
                                    <input type="text" placeholder="Nama Anda" required />
                                    <input type="email" placeholder="Email Anda" required />
                                </div>
                                <textarea placeholder="Pesan Anda" rows="6" required></textarea>
                                <button type="submit">Kirim Pesan</button>
                            </form>
                        </div>
                        <div className={styles.hoursInfo}>
                            <span className={styles.subheading}>KONTAK</span>
                            <h2>Send Us a Message</h2>
                            <p>
                                Tim kami akan merespons pesan Anda dalam 1-2 hari kerja.
                            </p>
                            <div className={styles.openingHours}>
                                <h4>Jam Operasional Tim</h4>
                                <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
                                <p>Sabtu & Minggu: Libur</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
};

export default ContactPage;