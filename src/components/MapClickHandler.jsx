// frontend/src/components/MapClickHandler.jsx
import { useMapEvents } from 'react-leaflet';

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      // Saat peta diklik, panggil fungsi onMapClick
      // yang kita dapat dari parent (HomePage)
      // dengan membawa koordinat (e.latlng)
      onMapClick(e.latlng);
    },
  });
  return null; // Komponen ini tidak me-render apa-apa
};

export default MapClickHandler;