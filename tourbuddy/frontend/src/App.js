import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingDetails from './pages/BookingDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Navigation component using auth context
const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">TourBuddy</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tours">Tours</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name ? user.name.split(' ')[0] : 'Profile'}
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    style={{ background: 'none', border: 'none' }} 
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/booking-details/:id" element={<BookingDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 