// Ambil base URL dari environment variables.
// Ini akan disuntikkan oleh Vite saat proses build.
const PHOTO_BASE_URL = import.meta.env.VITE_PHOTO_URL;

export function getImageUrl(photoPath, id) {
  // Jika tidak ada photoPath, kembalikan avatar default
  if (!photoPath) {
    return `https://i.pravatar.cc/150?u=${id || "default"}`;
  }

  // Jika photoPath sudah merupakan URL lengkap (misal: dari seeder),
  // langsung kembalikan.
  if (photoPath.startsWith("http")) {
    return photoPath;
  }

  // Jika ini adalah path relatif (misal: "uploads/images/file.jpg"),
  // gabungkan dengan base URL publik.
  // Logika ini mencegah adanya garis miring ganda (//).
  const cleanPath = photoPath.startsWith("/")
    ? photoPath.substring(1)
    : photoPath;
  const baseUrl = PHOTO_BASE_URL.endsWith("/")
    ? PHOTO_BASE_URL
    : `${PHOTO_BASE_URL}/`;

  return `${baseUrl}${cleanPath}`;
}
