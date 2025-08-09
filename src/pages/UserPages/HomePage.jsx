import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './HomePage.module.css';
import Header from '../../components/Header';
import React, { useState, useEffect, useRef, useMemo } from 'react';

// Komponen helper untuk mengatur ulang ukuran peta
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// --- BARU ---
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

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [cafes, setCafes] = useState([]);
    const position = [-6.2088, 106.8456];
    const markerRefs = useMemo(() => ({}), []);
    // --- BARU ---
    // State untuk fungsionalitas search
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCafes, setFilteredCafes] = useState([]);
    const [flyToPosition, setFlyToPosition] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try { setUser(jwtDecode(token)); } 
            catch (error) { console.error("Token tidak valid:", error); }
        }
        axios.get('http://localhost:5000/api/cafes')
            .then(response => setCafes(response.data))
            .catch(error => console.error('Gagal mengambil data kafe!', error));
    }, []);

    // --- BARU ---
    // Handler untuk logika pencarian
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

    // --- BARU ---
    // Handler saat hasil pencarian (atau item di sidebar) diklik
    const handleResultClick = (cafe) => {
      setFlyToPosition([cafe.latitude, cafe.longitude]);
      setTimeout(() => {
            const marker = markerRefs[cafe.id];
            if (marker) {
                marker.openPopup(); // Perintah untuk membuka popup
             }
      }, 1600); // Diberi sedikit jeda lebih lama dari durasi animasi (1.5s = 1500ms)

      setSearchTerm('');
      setFilteredCafes([]);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.homePageWrapper}>
            <Header />
            <div className={styles.mainContent}>
                <aside className={styles.sidebar}>
                    <h3>Featured Coffee Shops</h3>
                    <ul>
                        {cafes.slice(0, 6).map(cafe => (
                            // --- DIMODIFIKASI ---
                            // Membuat item di sidebar bisa diklik
                            <li key={cafe.id} className={styles.cafeItem} onClick={() => handleResultClick(cafe)}>
                                <img src={`https://i.pravatar.cc/40?u=${cafe.id}`} alt={cafe.name} />
                                <div className={styles.cafeInfo}>
                                    <h4>{cafe.name}</h4>
                                    <p>{cafe.address.substring(0, 20)}...</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className={styles.mapArea}>
                    {/* --- DIMODIFIKASI --- */}
                    {/* Mengubah mapHeader untuk fungsionalitas search */}
                    <div className={styles.mapHeader}>
                        <div className={styles.logo}>
                           <i className="fas fa-mug-hot"></i> NgopiYuk
                        </div>
                        <div className={styles.searchContainer}> {/* Pembungkus baru */}
                          <div className={styles.searchBar}>
                              <input 
                                type="text" 
                                placeholder="Search for coffee shops..." 
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
                        <MapFlyTo position={flyToPosition} /> {/* Komponen baru untuk animasi peta */}
                        {cafes.map(cafe => (
                            <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]}
                                ref={(el) => (markerRefs[cafe.id] = el)}>
                                <Popup>
                                    <div className={styles.popupCard}>
                                        <img className={styles.popupImage} src="https://source.unsplash.com/160x90/?coffee-shop" alt="Coffee Shop" />
                                        <div className={styles.popupContent}>
                                            <h4>{cafe.name}</h4>
                                            <p>4.5 ★★★★★</p>
                                            <button className={styles.popupBtn}>View Details</button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default HomePage;