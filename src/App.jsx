// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import HomePageRouter from './pages/HomePageRouter';
import ProfilePage from './pages/UserPages/ProfileRoute';
import AboutUs from './pages/AboutPages/AboutUs'; // Add this import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUs />} /> {/* Public about page */}
        
        {/* Protected Routes (Require Login) */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePageRouter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;