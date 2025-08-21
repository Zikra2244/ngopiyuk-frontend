import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./HomePage.module.css";

// Impor komponen pendukung
import Header from "../../components/Header";
import CafeDetailModal from "../../components/CafeDetailModal";
import { Rating } from "react-simple-star-rating";

// Komponen helper untuk mengatur ulang ukuran peta saat sidebar/konten berubah
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
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

const UserHomePage = () => {
  // === STATE MANAGEMENT ===
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cafes, setCafes] = useState([]);
  const position = [-6.2088, 106.8456];
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const markerRefs = useMemo(() => ({}), []);

  // State baru untuk fitur favorit
  const [sidebarView, setSidebarView] = useState("featured");
  const [favoriteCafes, setFavoriteCafes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // === DATA FETCHING & AUTHENTICATION CHECK ===
  const fetchProfileData = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: "Bearer " + authToken },
      });

      console.log("Favorites data:", response.data);

      // Ambil langsung dari "favorites"
      const favorites = response.data.favorites || [];

      setFavoriteCafes(favorites);
      setFavoriteIds(new Set(favorites.map((cafe) => cafe.id)));
    } catch (error) {
      console.error("Gagal mengambil data favorit:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        setUser(jwtDecode(storedToken));
        fetchProfileData(storedToken);
      } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem("token");
      }
    }
    axios
      .get("http://localhost:5000/api/cafes")
      .then((response) => setCafes(response.data))
      .catch((error) => console.error("Gagal mengambil data kafe!", error));
  }, []);

  // === HANDLER FUNCTIONS ===
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query) {
      const results = cafes.filter((cafe) =>
        cafe.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredCafes(results);
    } else {
      setFilteredCafes([]);
    }
  };

  const handleResultClick = (cafe) => {
    // pastikan ambil data lengkapnya dari cafes utama
    const fullCafe = cafes.find((c) => c.id === cafe.id) || cafe;

    if (fullCafe.latitude && fullCafe.longitude) {
      setFlyToPosition([fullCafe.latitude, fullCafe.longitude]);

      setTimeout(() => {
        const marker = markerRefs[fullCafe.id];
        if (marker) {
          marker.openPopup();
        }
      }, 1600);
    }

    setSearchTerm("");
    setFilteredCafes([]);
  };

  const handleAddFavorite = async (cafeId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/favorites", // ✅ pakai route dari favoriteRoutes.js
        { cafeId },
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchProfileData(token);
    } catch (error) {
      alert("Gagal memfavoritkan kafe.");
    }
  };

  const handleRemoveFavorite = async (cafeId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/favorites/${cafeId}`, // ✅ pakai route dari favoriteRoutes.js
        { headers: { Authorization: "Bearer " + token } }
      );

      fetchProfileData(token);
    } catch (error) {
      alert("Gagal menghapus favorit.");
    }
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
          <div className={styles.sidebarToggle}>
            <button
              className={sidebarView === "featured" ? styles.active : ""}
              onClick={() => setSidebarView("featured")}
            >
              Featured
            </button>
            <button
              className={sidebarView === "favorites" ? styles.active : ""}
              onClick={() => setSidebarView("favorites")}
            >
              Favorites
            </button>
          </div>

          <ul>
            {sidebarView === "featured" &&
              cafes.slice(0, 7).map((cafe) => (
                <li
                  key={cafe.id}
                  className={styles.cafeItem}
                  onClick={() => handleResultClick(cafe)}
                >
                  <img
                    src={
                      cafe.photoUrl
                        ? `http://localhost:5000/${cafe.photoUrl}`
                        : `https://i.pravatar.cc/40?u=${cafe.id}`
                    }
                    alt={cafe.name}
                  />
                  <div className={styles.cafeInfo}>
                    <h4>{cafe.name}</h4>
                    <p>{cafe.address.substring(0, 25)}...</p>
                  </div>
                </li>
              ))}

            {sidebarView === "favorites" &&
              (favoriteCafes.length > 0 ? (
                favoriteCafes.map((cafe) => (
                  <li
                    key={cafe.id}
                    className={styles.cafeItem}
                    onClick={() => handleResultClick(cafe)}
                  >
                    <img
                      src={
                        cafe.photoUrl
                          ? `http://localhost:5000/${cafe.photoUrl}`
                          : `https://i.pravatar.cc/40?u=${cafe.id}`
                      }
                      alt={cafe.name}
                    />
                    <div className={styles.cafeInfo}>
                      <h4>{cafe.name}</h4>
                      <p>{cafe.address.substring(0, 25)}...</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className={styles.cafeItem}>
                  <div className={styles.cafeInfo}>
                    <p>No favorites yet.</p>
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
                <input
                  type="text"
                  placeholder="Cari tempat ngopi..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button>
                  <i className="fas fa-search"></i>
                </button>
              </div>
              {filteredCafes.length > 0 && (
                <ul className={styles.searchResults}>
                  {filteredCafes.map((cafe) => (
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

          <MapContainer
            center={position}
            zoom={13}
            className={styles.mapContainer}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CARTO"
            />
            <ResizeMap />
            <MapFlyTo position={flyToPosition} />
            {cafes.map((cafe) => (
              <Marker
                key={cafe.id}
                position={[cafe.latitude, cafe.longitude]}
                ref={(el) => (markerRefs[cafe.id] = el)}
              >
                <Popup>
                  <div className={styles.popupCard}>
                    {cafe.photoUrl && (
                      <img
                        className={styles.popupImage}
                        src={`http://localhost:5000/${cafe.photoUrl}`}
                        alt={cafe.name}
                      />
                    )}
                    <div className={styles.popupContent}>
                      <h4>{cafe.name}</h4>
                      <div className={styles.popupRating}>
                        {cafe.reviewCount > 0 ? (
                          <>
                            <span>{parseFloat(cafe.avgRating).toFixed(1)}</span>
                            <Rating
                              initialValue={parseFloat(cafe.avgRating)}
                              readonly
                              size={20}
                              fillColor="#FFC107"
                              allowFraction
                            />
                            <span>({cafe.reviewCount})</span>
                          </>
                        ) : (
                          <span className={styles.noReviews}>
                            Belum ada ulasan
                          </span>
                        )}
                      </div>
                      <p>{cafe.address}</p>
                      <div className={styles.popupActions}>
                        {favoriteIds.has(cafe.id) ? (
                          <button
                            className={styles.favoritedBtn}
                            title="Remove from Favorites"
                            onClick={() => handleRemoveFavorite(cafe.id)}
                          >
                            ❤️
                          </button>
                        ) : (
                          <button
                            className={styles.favoriteBtn}
                            title="Add to Favorites"
                            onClick={() => handleAddFavorite(cafe.id)}
                          >
                            ♡
                          </button>
                        )}
                        <button
                          className={styles.detailsBtn}
                          onClick={() => setSelectedCafe(cafe)}
                        >
                          Lihat Ulasan
                        </button>
                      </div>
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
