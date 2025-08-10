import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './HomePage.module.css';

import Header from '../../components/Header';
import MapClickHandler from '../../components/MapClickHandler';
import AddCafeModal from '../../components/AddCafeModal';

// Komponen helper untuk mengatur ulang ukuran peta
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Komponen helper untuk memindahkan peta secara dinamis
function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { // Zoom ke level 15
        animate: true,
        duration: 1.5
      });
    }
  }, [position, map]);
  return null;
}

const AdminHomePage = () => {
  // === STATE MANAGEMENT ===
  const [user, setUser] = useState(null);
  const [cafes, setCafes] = useState([]);
  const position = [-6.2088, 106.8456]; // Posisi default Jakarta

  // State untuk fungsionalitas tambah kafe
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newCafeLocation, setNewCafeLocation] = useState(null);

  // State untuk fungsionalitas search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [flyToPosition, setFlyToPosition] = useState(null);

  const markerRefs = useMemo(() => ({}), []);

  // === DATA FETCHING ===
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try { const decodedUser = jwtDecode(token);
        // TAMBAHKAN BARIS INI UNTUK DEBUGGING
        console.log('ISI TOKEN YANG DIDECODE:', decodedUser); 
        setUser(decodedUser); 
      } 
      catch (error) { console.error("Token tidak valid:", error); }
    }
    axios.get('http://localhost:5000/api/cafes')
      .then(response => setCafes(response.data))
      .catch(error => console.error('Gagal mengambil data kafe!', error));
  }, []);

  // === HANDLER FUNCTIONS ===
  const handleMapClick = (latlng) => {
    if (isAddingMode) {
      setNewCafeLocation(latlng);
    }
  };
  
  const handleCafeAdded = (newCafe) => {
    setCafes([...cafes, newCafe]);
    setNewCafeLocation(null);
    setIsAddingMode(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query) {
      const results = cafes.filter(cafe =>
        cafe.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredCafes(results);
    } else {
      setFilteredCafes([]);
    }
  };

  const handleResultClick = (cafe) => {
    setFlyToPosition([cafe.latitude, cafe.longitude]);
    setTimeout(() => {
      const marker = markerRefs[cafe.id];
      if (marker) {
        marker.openPopup();
      }
    }, 1600);
    setSearchTerm('');
    setFilteredCafes([]);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // === RENDER COMPONENT ===
  return (
    <div className={styles.homePageWrapper}>
      <Header />
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <h3>Admin Dashboard</h3>
          <p>Selamat datang, {user && user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Pengguna'}!</p>
          <div className={styles.adminActions}>
             <button 
                className={styles.addLocationBtn} 
                onClick={() => setIsAddingMode(!isAddingMode)}
              >
                {isAddingMode ? '❌ Batal Menambah' : '📍 Tambah Kafe Baru'}
             </button>
             {isAddingMode && <p className={styles.instructionText}>Klik di peta untuk menandai lokasi...</p>}
          </div>
        </aside>

        <div className={styles.mapArea}>
          {newCafeLocation && (
            <AddCafeModal
              location={newCafeLocation}
              onClose={() => setNewCafeLocation(null)}
              onCafeAdded={handleCafeAdded}
            />
          )}

          <div className={styles.mapHeader}>
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Cari kafe yang sudah ada..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button><i className="fas fa-search"></i></button>
              </div>
              {filteredCafes.length > 0 && (
                <ul className={styles.searchResults}>
                  {filteredCafes.map(cafe => (
                    <li
                      key={cafe.id}
                      className={styles.searchResultItem}
                      onClick={() => handleResultClick(cafe)}
                    >
                      {cafe.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <MapContainer center={position} zoom={13} className={styles.mapContainer}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />
            <ResizeMap />
            <MapClickHandler onMapClick={handleMapClick} />
            <MapFlyTo position={flyToPosition} />

            {cafes.map(cafe => (
              <Marker 
                key={cafe.id} 
                position={[cafe.latitude, cafe.longitude]}
                ref={(el) => (markerRefs[cafe.id] = el)}
              >
                <Popup>{cafe.name}</Popup>
              </Marker>
            ))}

            {newCafeLocation && <Marker position={newCafeLocation}></Marker>}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;