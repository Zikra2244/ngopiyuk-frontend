    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { jwtDecode } from 'jwt-decode';
    import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
    import Header from '../components/Header'; // <-- TAMBAHKAN INI
    import Footer from '../components/Footer'; // <-- TAMBAHKAN INI
    import '../App.css';
    import MapClickHandler from '../components/MapClickHandler';
    import AddCafeModal from '../components/AddCafeModal';

    const HomePage = () => {
    const [user, setUser] = useState(null);
    const [cafes, setCafes] = useState([]);
    const position = [-6.2088, 106.8456];
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [newCafeLocation, setNewCafeLocation] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUser(jwtDecode(token));
        axios.get('http://localhost:5000/api/cafes')
        .then(response => setCafes(response.data))
        .catch(error => console.error('Gagal mengambil data kafe!', error));
    }, []);
    

    // Fungsi submit form (khusus admin)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCafe = { name, address, latitude: parseFloat(lat), longitude: parseFloat(lng) };
        try {
        const response = await axios.post('http://localhost:5000/api/cafes', newCafe);
        setCafes([...cafes, response.data]);
        setName(''); setAddress(''); setLat(''); setLng('');
        } catch (error) {
        console.error('Gagal menambahkan kafe!', error);
        }
    };

    // Tampilan Peta (digunakan oleh kedua role)
    const MapView = () => {
    const handleMapClick = (latlng) => {
        // Hanya set lokasi baru jika role adalah admin
        if (user.role === 'admin') {
            if (isAddingMode) {
                setNewCafeLocation(latlng);
            }
        }
    };

        return (
            <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />

            {/* Komponen pendengar event klik */}
            <MapClickHandler onMapClick={handleMapClick} />

            {/* Menampilkan semua kafe yang sudah ada */}
            {cafes.map(cafe => (
                <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]}>
                <Popup><b>{cafe.name}</b><br />{cafe.address}</Popup>
                </Marker>
            ))}

            {/* Menampilkan marker sementara jika admin sudah mengklik lokasi */}
            {newCafeLocation && (
                <Marker position={newCafeLocation}>
                <Popup>
                    <div>
                    <p>Lokasi Kafe Baru</p>
                    <button>Lanjutkan</button>
                    </div>
                </Popup>
                </Marker>
            )}
            </MapContainer>
        );
    };
    
    const [isAddingMode, setIsAddingMode] = useState(false);
    const handleCafeAdded = (newCafe) => {
        setCafes([...cafes, newCafe]);
        setNewCafeLocation(null);
        setIsAddingMode(false); // <-- Mode menambah dimatikan DI SINI
    };


    // Tampilan loading sampai data user berhasil dibaca
    if (!user) {
        return <div>Loading...</div>;
    }

    // Render komponen berdasarkan peran (role)
    return (
  <     div className="homepage-container">
    
        {user.role === 'admin' && (
            <button 
                className="add-location-btn" 
                onClick={() => setIsAddingMode(!isAddingMode)} // Toggle mode
            >
                {isAddingMode ? 'Batal Menambah' : '📍 Tambah Lokasi Baru'}
            </button>
        )}

    <Header />
    <main className="main-content">
      {newCafeLocation && (
        <AddCafeModal
          location={newCafeLocation}
          onClose={() => setNewCafeLocation(null)}
          onCafeAdded={handleCafeAdded}
        />
         )}
         <MapView />
        </main>
    <Footer />
    </div>
    );
    };

    export default HomePage;
