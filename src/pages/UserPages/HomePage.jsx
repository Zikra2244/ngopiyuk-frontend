import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './HomePage.module.css';

import Header from '../../components/Header';
import CafeDetailModal from '../../components/CafeDetailModal';
import { Rating } from 'react-simple-star-rating';

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

const UserHomePage = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cafes, setCafes] = useState([]);
  const position = [-6.2088, 106.8456];
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const markerRefs = useMemo(() => ({}), []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        setUser(jwtDecode(storedToken));
      } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem('token');
      }
    }
    axios.get('http://localhost:5000/api/cafes')
      .then(response => setCafes(response.data))
      .catch(error => console.error('Gagal mengambil data kafe!', error));
  }, []);

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

  return (
    <div className={styles.homePageWrapper}>
      <Header />
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <h3>Featured Coffee Shops</h3>
          <ul>
            {cafes.slice(0, 7).map(cafe => (
              <li key={cafe.id} className={styles.cafeItem} onClick={() => handleResultClick(cafe)}>
                <img src={cafe.photoUrl ? `http://localhost:5000/${cafe.photoUrl}` : `https://i.pravatar.cc/40?u=${cafe.id}`} alt={cafe.name} />
                <div className={styles.cafeInfo}>
                  <h4>{cafe.name}</h4>
                  <p>{cafe.address.substring(0, 25)}...</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.mapArea}>
          <div className={styles.mapHeader}>
            <div className={styles.logo}>
               <i className="fas fa-mug-hot"></i> NgopiYuk
            </div>
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                  <input type="text" placeholder="Cari tempat ngopi..." value={searchTerm} onChange={handleSearchChange} />
                  <button><i className="fas fa-search"></i></button>
              </div>
              {filteredCafes.length > 0 && (
                <ul className={styles.searchResults}>
                  {filteredCafes.map(cafe => (
                    <li key={cafe.id} className={styles.searchResultItem} onClick={() => handleResultClick(cafe)}>
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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <ResizeMap />
            <MapFlyTo position={flyToPosition} />
            {cafes.map(cafe => (
              <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]} ref={(el) => (markerRefs[cafe.id] = el)}>
                <Popup>
                  <div className={styles.popupCard}>
                    {cafe.photoUrl && (
                      <img className={styles.popupImage} src={`http://localhost:5000/${cafe.photoUrl}`} alt={cafe.name} />
                    )}
                    <div className={styles.popupContent}>
                      <h4>{cafe.name}</h4>
                      <div className={styles.popupRating}>
                        {cafe.reviewCount > 0 ? (
                          <>
                            <span>{parseFloat(cafe.avgRating).toFixed(1)}</span>
                            <Rating initialValue={parseFloat(cafe.avgRating)} readonly size={20} fillColor="#FFC107" allowFraction />
                            <span>({cafe.reviewCount})</span>
                          </>
                        ) : (
                          <span className={styles.noReviews}>Belum ada ulasan</span>
                        )}
                      </div>
                      <p>{cafe.address}</p>
                      <button className={styles.popupBtn} onClick={() => setSelectedCafe(cafe)}>
                        Lihat Ulasan & Detail
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedCafe && (
        <CafeDetailModal 
          cafe={selectedCafe} 
          onClose={() => setSelectedCafe(null)} 
          token={token}
        />
      )} 
    </div>
  );
};

export default UserHomePage;