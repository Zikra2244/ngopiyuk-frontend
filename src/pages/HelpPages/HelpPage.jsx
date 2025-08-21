import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HelpPage.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import faqIllustration from '../../assets/faq-illustration.svg';

const faqData = [
  {
    category: 'Cara Kerja NgopiYuk!',
    questions: [
      { q: 'Bagaimana cara mencari kafe di kota saya?', a: 'Cukup ketik nama kota atau kafe di kolom pencarian. Kamu juga bisa menggunakan filter untuk menyesuaikan hasil pencarian sesuai kebutuhanmu.' },
      { q: 'Apakah saya bisa memfilter kafe berdasarkan rating atau fasilitas tertentu?', a: 'Bisa. NgopiYuk! menyediakan filter berdasarkan rating, harga, dan fasilitas (misalnya WiFi, smoking area, atau area outdoor).' },
      { q: 'Apakah saya bisa menyimpan kafe favorit saya?', a: 'Ya, dengan akun NgopiYuk! kamu bisa menandai kafe sebagai favorit agar mudah ditemukan kembali.' },
    ]
  },
  {
    category: 'Akun & Profil',
    questions: [
      { q: 'Bagaimana cara mendaftar akun di NgopiYuk!?', a: 'Klik tombol Daftar, lalu isi nama, email, dan password. Kamu juga bisa mendaftar menggunakan akun Google.' },
      { q: 'Bagaimana cara mengubah username atau avatar saya?', a: 'Masuk ke menu Lihat Profil, lalu pilih Edit Profil. Dari sana, kamu bisa mengubah data sesuai kebutuhan.' },
      { q: 'Saya lupa password, apa yang harus dilakukan?', a: 'Saat ini fitur lupa password sedang dalam pengembangan. Untuk sementara, silakan hubungi admin.' },
      { q: 'Apakah akun saya aman di platform ini?', a: 'Ya, kami melindungi data pengguna dengan sistem keamanan enkripsi dan tidak membagikan data pribadi tanpa izin.' },
    ]
  },
  {
    category: 'Ulasan & Rating',
    questions: [
      { q: 'Bagaimana cara memberi ulasan pada sebuah kafe?', a: 'Buka halaman kafe yang ingin kamu ulas, lalu klik tombol Tulis Ulasan. Kamu bisa memberikan rating bintang dan menambahkan komentar.' },
      { q: 'Apakah saya bisa mengedit atau menghapus ulasan saya?', a: 'Bisa. Masuk ke menu Profil Saya → Ulasan Saya, pilih ulasan yang ingin diedit atau dihapus.' },
      { q: 'Apakah ulasan saya bisa dilihat oleh pengguna lain?', a: 'Ya, semua ulasan akan ditampilkan secara publik agar membantu pengguna lain dalam memilih kafe.' },
      { q: 'Bagaimana sistem rating di NgopiYuk! bekerja?', a: 'Rating dihitung dari rata-rata bintang yang diberikan semua pengguna.' },
      { q: '', a: '' },
    ]
  },
  {
    category: 'Lainnya',
    questions: [
      { q: 'Apakah menggunakan NgopiYuk! gratis?', a: 'Ya, semua fitur NgopiYuk! dapat digunakan secara gratis.' },
      { q: 'Apakah NgopiYuk! tersedia di seluruh kota di Indonesia?', a: 'Saat ini kami berupaya menyediakan data kafe di berbagai kota besar, dan terus menambah daftar kafe di seluruh Indonesia.' },
      { q: 'Bagaimana cara menghubungi tim NgopiYuk! jika saya menemukan masalah?', a: 'Kamu bisa menghubungi kami melalui menu Hubungi Kami atau mengirim email ke support@ngopiyuk.id.' },
      { q: 'Apakah saya bisa merekomendasikan kafe baru yang belum ada di NgopiYuk!', a: 'Saat ini fitur rekomendasi kafe sedang dalam pengembangan. Untuk sementara, silakan hubungi admin' },
    ]
  }
];

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className={styles.accordionItem}>
      <button className={styles.accordionHeader} onClick={onClick}>
        <span>{item.q}</span>
        <span className={`${styles.accordionIcon} ${isOpen ? styles.open : ''}`}></span>
      </button>
      {isOpen && (
        <div className={styles.accordionContent}>
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
};


const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const leftColumnData = faqData.slice(0, 2);
  const rightColumnData = faqData.slice(2, 4);

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   alert("Terima kasih! Pesan Anda telah terkirim.");
  //   e.target.reset();
  // };

  return (
    <>
      <Header />
      <div className={styles.helpPage}>
        {/* <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>Bagaimana Kami Bisa Membantu?</h1>
            <p>Temukan jawaban yang Anda butuhkan atau hubungi tim kami secara langsung.</p>
          </div>
        </section> */}

         {/* --- KONTEN UTAMA DENGAN STRUKTUR BARU --- */}
        <main className={styles.mainContentWrapper}>
          <Link to="/" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </Link>

          <div className={styles.pageHeader}>
            <span className={styles.subheading}>QUESTIONS / ANSWERS</span>
            <h2>Frequently Asked Questions</h2>
            <p>Temukan jawaban yang Anda butuhkan.</p>
          </div>
          
          {/* ▼▼▼ UBAH STRUKTUR GRID DI SINI ▼▼▼ */}
          <div className={styles.faqGrid}>
            {faqData.map((category, catIndex) => (
              // Setiap kategori sekarang menjadi sebuah "kartu" di dalam grid
              <div key={catIndex} className={styles.faqCategoryCard}>
                <h3 className={styles.categoryTitle}>{category.category}</h3>
                <div className={styles.accordion}>
                  {category.questions.map((item, itemIndex) => {
                    if (!item.q) return null;
                    const fullIndex = `${catIndex}-${itemIndex}`;
                    return (
                      <AccordionItem 
                        key={fullIndex}
                        item={item}
                        isOpen={openIndex === fullIndex}
                        onClick={() => handleAccordionClick(fullIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* ▲▲▲ AKHIR DARI PERUBAHAN GRID ▲▲▲ */}

        </main>
      </div>
      <Footer />
    </>
  );
};
export default HelpPage;