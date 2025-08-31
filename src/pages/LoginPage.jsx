// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import api, { API_URL } from "@/services/api";

const LoginPage = () => {
  // State untuk menampung input email dan password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook untuk melakukan navigasi/redirect setelah login
  const navigate = useNavigate();

  // Fungsi yang dijalankan saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah form me-refresh halaman

    try {
      // Kirim request POST ke endpoint login di backend
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      // 1. Simpan token ke localStorage browser
      // Ini membuat pengguna tetap login bahkan setelah me-refresh halaman
      localStorage.setItem("token", token);

      // 2. Arahkan pengguna ke halaman utama
      navigate("/home");
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login gagal! Periksa kembali email dan password Anda.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-link">
          Belum punya akun? <Link to="/register">Register di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
