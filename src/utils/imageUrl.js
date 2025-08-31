export const API_URL = import.meta.env.VITE_PHOTO_URL;

// src/utils/photoUrl.js
export function getImageUrl(photoPath, id) {
  const photoBaseUrl = import.meta.env.VITE_PHOTO_URL || "";

  if (photoPath) {
    // contoh: http://localhost:5000/uploads/namafile.jpg
    return `${photoBaseUrl}/${photoPath}`;
  }

  // fallback avatar kalau tidak ada foto
  return `https://i.pravatar.cc/40?u=${id}`;
}
