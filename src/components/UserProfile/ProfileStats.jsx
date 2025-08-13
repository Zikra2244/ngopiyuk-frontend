import React from 'react';
import styles from './ProfileStats.module.css';

const ProfileStats = ({ reviewsCount, favoritesCount }) => {
  return (
    <div className={styles.activityStats}>
      <h2>Statistik Aktivitas</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{reviewsCount}</div>
          <div className={styles.statLabel}>Ulasan Ditulis</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{favoritesCount}</div>
          <div className={styles.statLabel}>Kafe Difavoritkan</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;