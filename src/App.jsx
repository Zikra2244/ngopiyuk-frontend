// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import HomePageRouter from './pages/HomePageRouter';
import ProfilePage from './pages/UserPages/ProfileRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rute yang Dilindungi (Harus Login) */}
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