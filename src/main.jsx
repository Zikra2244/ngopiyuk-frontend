// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css'; // <-- TAMBAHKAN BARIS INI

ReactDOM.createRoot(document.getElementById('root')).render(
    <App /> 
);