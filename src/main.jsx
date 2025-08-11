// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // <-- Impor axios

// --- TAMBAHKAN BLOK INTERCEPTOR INI ---
axios.interceptors.response.use(response => {
  // Jika respons berhasil, lanjutkan saja
  return response;
}, error => {
  // Jika ada error, periksa apakah statusnya 401
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token'); // Hapus token yang tidak valid
    alert('Sesi Anda telah berakhir, silakan login kembali.');
    window.location.href = '/login'; // Arahkan ke halaman login
  }
  return Promise.reject(error);
});
// ---

ReactDOM.createRoot(document.getElementById('root')).render(
  // <App /> // Hapus StrictMode jika masih ada masalah
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);