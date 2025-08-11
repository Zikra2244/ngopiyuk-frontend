// frontend/src/components/AdminReviewModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';
// Kita gunakan CSS yang sama dengan modal detail user agar tampilannya konsisten
import styles from './CafeDetailModal.module.css'; 

const AdminReviewModal = ({ cafe, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
                    {review.photoUrl && <img src={`http://localhost:5000/${review.photoUrl}`} alt={review.title} className={styles.reviewImage} />}
                    <p>{review.description}</p>
                    <small>oleh: {review.User ? review.User.username : 'Anonim'}</small>
                  </li>
                ))}
              </ul>
            ) : <p>Belum ada ulasan untuk tempat ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewModal;