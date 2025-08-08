import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // Pastikan 'useMap' diimpor
import 'leaflet/dist/leaflet.css';
import styles from './HomePage.module.css';
import Header from '../components/Header';

// Komponen helper untuk mengatur ulang ukuran peta
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [cafes, setCafes] = useState([]);
    const position = [-6.2088, 106.8456];

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
                            <li key={cafe.id} className={styles.cafeItem}>
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
                    <div className={styles.mapHeader}>
                        <div className={styles.logo}>
                           <i className="fas fa-mug-hot"></i> NgopiYuk
                        </div>
                        <div className={styles.searchBar}>
                            <input type="text" placeholder="Search for coffee shops..." />
                            <button><i className="fas fa-search"></i></button>
                        </div>
                    </div>

                    <MapContainer center={position} zoom={13} className={styles.mapContainer}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://cartocdn.com/attributions">CARTO</a>'
                        />
                        <ResizeMap /> {/* Panggil komponen di sini */}
                        {cafes.map(cafe => (
                            <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]}>
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