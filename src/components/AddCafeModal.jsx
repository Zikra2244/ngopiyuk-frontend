import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const AddCafeModal = ({ location, onClose, onCafeAdded, token }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handler untuk mengirim data kafe baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      return alert("Sesi tidak valid, silakan login ulang.");
    }
    if (!photoFile) { 
      return alert('Mohon pilih foto untuk kafe.');
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    formData.append('photo', photoFile); // 'photo' harus sama dengan di rute

    try {
      const response = await axios.post(
        'http://localhost:5000/api/cafes', formData,
        { headers: { Authorization: 'Bearer ' + token } }
      );
      onCafeAdded(response.data);
      onClose();
    } catch (error) {
      console.error('Gagal menyimpan kafe', error);
      alert('Gagal menyimpan kafe!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tambahkan Detail Kafe</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Kafe</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Alamat</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Foto Kafe (Wajib)</label>
            <input 
              type="file" 
              accept=".jpg,.png,.jpeg"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              required 
            />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input type="text" value={location.lat.toFixed(6)} readOnly disabled />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="text" value={location.lng.toFixed(6)} readOnly disabled />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan Kafe</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCafeModal;