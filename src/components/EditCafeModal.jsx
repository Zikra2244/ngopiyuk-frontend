import React, { useState } from "react";
import axios from "axios";
// Kita akan buatkan CSS Module khusus untuk modal ini agar lebih rapi
import styles from "./EditCafeModal.module.css";
import api, { API_URL } from "@/services/api";
import { getImageUrl } from "@/utils/imageUrl";

const EditCafeModal = ({ cafe, onClose, onCafeUpdated, token }) => {
  // Isi state form dengan data kafe yang sudah ada
  const [name, setName] = useState(cafe.name);
  const [address, setAddress] = useState(cafe.address);
  const [photoFile, setPhotoFile] = useState(null); // State untuk file baru

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    // Kita tidak mengirim latitude/longitude karena tidak diubah di form ini

    // Hanya tambahkan foto jika admin memilih file baru
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const response = await api.put(`/cafes/${cafe.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type otomatis
        },
      });

      onCafeUpdated(response.data); // Kirim data terbaru ke parent
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Gagal mengupdate kafe:", error);
      alert("Gagal mengupdate kafe!");
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>Edit Detail Kafe</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nama Kafe</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Foto Saat Ini</label>
            <img
              src={getImageUrl(cafe.photoUrl, cafe.id)}
              alt={cafe.name}
              className={styles.imagePreview}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getImageUrl(null, cafe.id);
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ganti Foto (Opsional)</label>
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnSecondary}
            >
              Batal
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCafeModal;
