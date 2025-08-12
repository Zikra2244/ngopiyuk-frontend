// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // CSS baru untuk styling ala landing page

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        role,
      });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      console.error('Gagal register:', error);
      alert('Registrasi gagal! Email mungkin sudah digunakan.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Buat Akun</h2>
        <p className="register-subtitle">
          Gabung dan mulai perjalanan kopi Anda
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
            />
          </div>
          <div className="form-group">
            <label>Daftar sebagai</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin (Pemilik Kafe)</option>
            </select>
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="register-link">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
