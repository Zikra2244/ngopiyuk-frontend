import React from 'react';
import { useState, useEffect } from 'react'; // Hooks diimpor secara terpisah
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';
import styles from './CafeDetailModal.module.css';

const CafeDetailModal = ({ cafe, onClose, token }) => {
  // State untuk data dan UI
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form ulasan baru
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [photoFile, setPhotoFile] = useState(null);

  // Efek untuk menutup modal dengan tombol 'Escape'
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Efek untuk mengambil ulasan saat modal dibuka
  useEffect(() => {
    if (!cafe) return;
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/cafes/${cafe.id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Gagal mengambil ulasan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [cafe]);

  // Handler untuk mengirim ulasan baru
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Mohon berikan rating bintang.");
    if (!token) return alert("Token tidak ditemukan, silakan login ulang.");
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('rating', rating);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/cafes/${cafe.id}/reviews`,
        formData,
        { 
          headers: { 
            Authorization: 'Bearer ' + token,
          } 
        }
      );
      
      setReviews(response.data);
      // Kosongkan form setelah berhasil
      setTitle('');
      setDescription('');
      setRating(0);
      setPhotoFile(null);
      if (document.getElementById('photo-input')) {
        document.getElementById('photo-input').value = null;
      }
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
      alert("Gagal mengirim ulasan!");
    }
  };

  if (!cafe) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2>{cafe.name}</h2>
        <p className={styles.address}>{cafe.address}</p>
        <hr />

        <div className={styles.reviewsSection}>
          <h3>Ulasan Pengguna</h3>
          {isLoading ? <p>Memuat ulasan...</p> : (
            reviews.length > 0 ? (
              <ul className={styles.reviewList}>
                {reviews.map(review => (
                  <li key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <strong>{review.title}</strong>
                      <Rating initialValue={review.rating} readonly size={20} fillColor="#FFC107" />
                    </div>
                    {review.photoUrl && <img src={`http://localhost:5000/${review.photoUrl}`} alt={`Ulasan untuk ${review.title}`} className={styles.reviewImage} />}
                    <p>{review.description}</p>
                    <small>oleh: {review.User ? review.User.username : 'Anonim'}</small>
                  </li>
                ))}
              </ul>
            ) : <p>Belum ada ulasan untuk tempat ini. Jadilah yang pertama!</p>
          )}
        </div>

        <hr />

        <div className={styles.formSection}>
          <h3>Tulis Ulasan Anda</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className={styles.ratingInput}>
              <label>Rating Anda:</label>
              <Rating
                onClick={(rate) => setRating(rate)}
                initialValue={rating}
                size={30}
                fillColor="#FFC107"
                emptyColor="#E4E5E9"
              />
            </div>
            <input 
              type="text" 
              placeholder="Judul ulasan (cth: Kopi Susunya Juara!)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
            <textarea 
              placeholder="Deskripsikan pengalaman Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <div className={styles.formGroup}>
              <label>Upload Foto (Opsional)</label>
              <input 
                id="photo-input"
                type="file" 
                accept=".jpg,.png,.jpeg"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className={styles.submitButton}>Kirim Ulasan</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailModal;