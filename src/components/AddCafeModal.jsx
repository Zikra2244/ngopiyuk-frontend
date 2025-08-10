// frontend/src/components/AddCafeModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const AddCafeModal = ({ location, onClose, onCafeAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // L FITUR BARU 1: Menangani tombol 'Escape' L
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose(); // Panggil fungsi onClose jika 'Esc' ditekan
      }
    };

    // Tambahkan event listener saat komponen muncul
    document.addEventListener('keydown', handleKeyDown);

    // Hapus event listener saat komponen hilang (cleanup)
    // Ini penting untuk mencegah memory leak!
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); // Dependency array memastikan fungsi selalu up-to-date


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCafeData = {
      name,
      address,
      latitude: location.lat,
      longitude: location.lng,
    };
    try {
      const response = await axios.post('http://localhost:5000/api/cafes', newCafeData);
      onCafeAdded(response.data);
      onClose();
    } catch (error) {
      console.error('Gagal menyimpan kafe', error);
      alert('Gagal menyimpan kafe!');
    }
  };

  return (
    // L FITUR BARU 2: Menangani klik di luar box (backdrop) L
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tambahkan Detail Kafe</h2>
        <form onSubmit={handleSubmit}>
          {/* ... sisa form tetap sama ... */}
          <div className="form-group">
            <label>Nama Kafe</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Alamat</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input type="text" value={location.lat} readOnly disabled />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="text" value={location.lng} readOnly disabled />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
       git add .     <button type="submit" className="btn-primary">Simpan Kafe</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCafeModal;