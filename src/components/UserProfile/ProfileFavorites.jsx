import React from 'react';
import styles from './ProfileFavorites.module.css';

const ProfileFavorites = ({ favoriteCafes }) => {
  return (
    <div className={styles.favoriteCafes}>
      <h2>Kafe Favorit Saya</h2>
      <div className={styles.cafesList}>
        {favoriteCafes.length > 0 ? (
          <ul className={styles.cafeList}>
            {favoriteCafes.map((cafe, index) => (
              <li key={index} className={styles.cafeItem}>
                {cafe.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>Belum ada kafe favorit yang disimpan.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileFavorites;