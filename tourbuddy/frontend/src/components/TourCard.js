import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Function to get a consistent image for each tour based on the tour ID
const getTourImage = (id) => {
  const images = [
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Paris
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80', // Tokyo
    'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80', // New York
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1871&q=80', // Safari
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1886&q=80', // Venice
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Peru
    'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', // Australia
    'https://images.unsplash.com/photo-1520769490320-493e53d9a43f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80', // Norway - Fixed
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80', // Greece
    'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Thailand
  ];
  
  // Use modulo to ensure we don't go out of bounds
  const index = (id - 1) % images.length;
  return images[index];
};

const TourCard = ({ tour }) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card tour-card">
      <div className="position-relative">
        <img 
          src={imageError ? fallbackImage : getTourImage(tour.id)} 
          className="card-img-top" 
          alt={tour.title} 
          onError={handleImageError}
        />
        <div className="position-absolute top-0 end-0 bg-primary text-white py-1 px-2 m-2 rounded">
          ${tour.price}
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{tour.title}</h5>
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
          <h6 className="card-subtitle mb-0 text-muted">{tour.location}</h6>
        </div>
        <div className="card-text d-flex justify-content-between align-items-center mb-3">
          <span className="d-flex align-items-center">
            <i className="bi bi-clock me-1 text-primary"></i>
            <span>{tour.duration} days</span>
          </span>
          <span className="badge bg-light text-dark">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {(4 + Math.random()).toFixed(1)}
          </span>
        </div>
        <Link to={`/tours/${tour.id}`} className="btn btn-primary w-100 btn-animated">
          <i className="bi bi-eye me-2"></i>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TourCard; 