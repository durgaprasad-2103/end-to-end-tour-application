import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Import the image utility from the TourCard component
const getTourImage = (id) => {
  const images = [
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Paris
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80', // Tokyo
    'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80', // New York
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1871&q=80', // Safari
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1886&q=80', // Venice
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Peru
    'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', // Australia
    'https://images.unsplash.com/photo-1520769490320-493e53d9a43f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1856&q=80', // Norway
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80', // Greece
    'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', // Thailand
  ];
  
  // Make sure id is a valid index and is a number
  const safeId = parseInt(id) || 1;
  
  // Use modulo to ensure we don't go out of bounds
  const index = (safeId - 1) % images.length;
  return images[index >= 0 ? index : 0];
};

// Get additional images for the gallery section
const getAdditionalImages = (id) => {
  const allImages = [
    // Paris extras
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1923&q=80',
    'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    // Tokyo extras
    'https://images.unsplash.com/photo-1653047017581-30edec01e779?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9rb3lvfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1557409518-691ebcd96038?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW58ZW58MHx8MHx8fDA%3D',
    // New York extras
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG5ldyUyMHlvcmt8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1476837754190-8036496cea40?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG5ldyUyMHlvcmt8ZW58MHx8MHx8fDA%3D',
    // Safari extras
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FmYXJpJTIwYWZyaWNhfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1701169858049-53e2a731c825?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNhZmFyaSUyMGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1710279714474-26e5e221704f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhZmFyaSUyMGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D',
    // Venice extras
    'https://images.unsplash.com/photo-1574530638414-88578d1f73a2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVuaWNlJTIwaXRhbHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1589113659499-eea2ccca202e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFZlbmljZSUyMEdvbmRvbGElMjBUb3VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=1932&q=80',
    'https://plus.unsplash.com/premium_photo-1676120651951-c84af43eaf9a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8VmVuaWNlJTIwR29uZG9sYSUyMFRvdXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1960&q=80',
    // treak extrs 
    'https://images.unsplash.com/photo-1715272775548-51bd004bd775?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEluY2ElMjBUcmFpbCUyMFRyZWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1651852240077-51239281936f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEluY2ElMjBUcmFpbCUyMFRyZWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1740&q=80',
    'https://plus.unsplash.com/premium_photo-1733266859669-d684c7212fbd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEluY2ElMjBUcmFpbCUyMFRyZWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1886&q=80',
    // great barrier reef extras
    'https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3JlYXQlMjBCYXJyaWVyJTIwUmVlZiUyMERpdmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1717292741615-4695bafa9663?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8R3JlYXQlMjBCYXJyaWVyJTIwUmVlZiUyMERpdmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1717292741610-70b4825fe272?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R3JlYXQlMjBCYXJyaWVyJTIwUmVlZiUyMERpdmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1935&q=80',
    // Norway extras
    'https://images.unsplash.com/photo-1498825350378-fc468c285f96?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Tm9ydGhlcm4lMjBMaWdodHMlMjBFeHBlZGl0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1645443545274-2f79770772bc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fE5vcnRoZXJuJTIwTGlnaHRzJTIwRXhwZWRpdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1647251532818-0b948471e86f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fE5vcnRoZXJuJTIwTGlnaHRzJTIwRXhwZWRpdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1935&q=80',
    // Greece extras
    'https://plus.unsplash.com/premium_photo-1661962428291-7ec1fd509076?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3JlZWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdyZWVjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=1935&q=80',
    // Thailand extras
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2tva3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmFuZ2tva3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1598970605070-a38a6ccd3a2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJhbmdrb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1935&q=80',

  ];
  
  // Make sure id is a valid number
  const safeId = parseInt(id) || 1;
  
  // Calculate base index, ensuring it's valid
  const baseIndex = ((safeId - 1) % 10) * 3;
  
  // Return 3 images for the gallery, with safety checks
  return [
    allImages[baseIndex % allImages.length],
    allImages[(baseIndex + 1) % allImages.length],
    allImages[(baseIndex + 2) % allImages.length]
  ];
};

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryImageErrors, setGalleryImageErrors] = useState({});
  
  const fallbackImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`/api/tours/${id}`);
        setTour(response.data.data.tour);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tour details. Please try again later.');
        setLoading(false);
        console.error('Error fetching tour details:', err);
      }
    };

    fetchTourDetails();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMainImageError = () => {
    setMainImageError(true);
  };

  const handleGalleryImageError = (index) => {
    setGalleryImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tour details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Tour not found.
        </div>
        <Link to="/tours" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Tours
        </Link>
      </div>
    );
  }

  const galleryImages = getAdditionalImages(parseInt(id));

  return (
    <div className="fade-in">
      <div 
        className="hero-section" 
        style={{ 
          backgroundImage: `url(${mainImageError ? fallbackImage : getTourImage(parseInt(id))})`,
          height: '50vh',
          backgroundAttachment: 'fixed'
        }}
        onError={handleMainImageError}
      >
        <div className="hero-overlay d-flex align-items-center">
          <div className="container hero-text">
            <h1 className="display-4 fw-bold">{tour.title}</h1>
            <div className="d-flex align-items-center text-white mt-3">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <span className="fs-5">{tour.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5 detail-section">
        <div className="row">
          <div className="col-lg-8">
            <nav className="nav nav-pills nav-fill mb-4">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabChange('overview')}
              >
                <i className="bi bi-info-circle me-2"></i>
                Overview
              </button>
              <button 
                className={`nav-link ${activeTab === 'itinerary' ? 'active' : ''}`}
                onClick={() => handleTabChange('itinerary')}
              >
                <i className="bi bi-calendar3 me-2"></i>
                Itinerary
              </button>
              <button 
                className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => handleTabChange('gallery')}
              >
                <i className="bi bi-images me-2"></i>
                Gallery
              </button>
            </nav>
            
            {activeTab === 'overview' && (
              <div>
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title border-bottom pb-3 mb-3">Tour Details</h3>
                    <div className="row g-4">
                      <div className="col-md-3 col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-clock fs-3 text-primary mb-2"></i>
                          <h6 className="fw-bold mb-1">Duration</h6>
                          <p className="text-muted mb-0">{tour.duration} days</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-cash-stack fs-3 text-primary mb-2"></i>
                          <h6 className="fw-bold mb-1">Price</h6>
                          <p className="text-muted mb-0">${tour.price}</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-people fs-3 text-primary mb-2"></i>
                          <h6 className="fw-bold mb-1">Group Size</h6>
                          <p className="text-muted mb-0">Max 12 people</p>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="d-flex flex-column align-items-center">
                          <i className="bi bi-star fs-3 text-primary mb-2"></i>
                          <h6 className="fw-bold mb-1">Rating</h6>
                          <p className="text-muted mb-0">4.8/5.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title border-bottom pb-3 mb-3">Description</h3>
                    <p className="lead">
                      Experience the beauty and culture of {tour.location} on this {tour.duration}-day adventure!
                    </p>
                    <p>
                      This tour offers a perfect blend of sightseeing, relaxation, and cultural immersion.
                      From historical landmarks to natural wonders, this tour covers all the must-see attractions
                      in {tour.location}. 
                    </p>
                    <p>
                      Join us on this unforgettable journey and create memories that will last a lifetime. Our experienced
                      guides will take you off the beaten path to discover hidden gems and local favorites that most tourists
                      never see.
                    </p>
                  </div>
                </div>
                
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title border-bottom pb-3 mb-3">Highlights</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            All-inclusive package with quality accommodations
                          </li>
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Professional tour guide throughout the trip
                          </li>
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Visit to iconic landmarks and attractions
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Comfortable transportation between destinations
                          </li>
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Daily breakfast and select meals included
                          </li>
                          <li className="list-group-item bg-transparent px-0">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Immersive cultural experiences with locals
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'itinerary' && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="card-title border-bottom pb-3 mb-4">Tour Itinerary</h3>
                  
                  <div className="timeline">
                    <div className="timeline-item mb-4 pb-3 border-bottom">
                      <div className="d-flex">
                        <div className="timeline-badge bg-primary text-white rounded-circle p-3 me-3">
                          <span className="fw-bold">1</span>
                        </div>
                        <div>
                          <h4>Day 1: Arrival and Welcome</h4>
                          <p className="text-muted">
                            <i className="bi bi-clock-history me-2"></i>
                            Full Day
                          </p>
                          <p>
                            Arrive at your destination and check into your hotel. Meet your tour guide and fellow travelers
                            during a welcome dinner at a local restaurant. Get briefed about the exciting journey ahead.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="timeline-item mb-4 pb-3 border-bottom">
                      <div className="d-flex">
                        <div className="timeline-badge bg-primary text-white rounded-circle p-3 me-3">
                          <span className="fw-bold">2</span>
                        </div>
                        <div>
                          <h4>Day 2: City Exploration</h4>
                          <p className="text-muted">
                            <i className="bi bi-clock-history me-2"></i>
                            Full Day
                          </p>
                          <p>
                            Visit the main attractions of the city with a knowledgeable local guide. Enjoy lunch at a famous
                            local establishment and continue exploring in the afternoon. Evening at leisure to explore on your own.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="timeline-item mb-4 pb-3 border-bottom">
                      <div className="d-flex">
                        <div className="timeline-badge bg-primary text-white rounded-circle p-3 me-3">
                          <span className="fw-bold">3</span>
                        </div>
                        <div>
                          <h4>Day 3: Cultural Immersion</h4>
                          <p className="text-muted">
                            <i className="bi bi-clock-history me-2"></i>
                            Full Day
                          </p>
                          <p>
                            Immerse yourself in the local culture with activities like cooking classes, craft workshops, or traditional performances.
                            Visit local markets and interact with artisans to learn about traditional crafts.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {tour.duration > 3 && (
                      <div className="timeline-item">
                        <div className="d-flex">
                          <div className="timeline-badge bg-primary text-white rounded-circle p-3 me-3">
                            <span className="fw-bold">4+</span>
                          </div>
                          <div>
                            <h4>Day 4 and Beyond</h4>
                            <p className="text-muted">
                              <i className="bi bi-clock-history me-2"></i>
                              Multiple Days
                            </p>
                            <p>
                              Continue exploring the region's highlights, including natural wonders, historical sites, and hidden gems.
                              Detailed itinerary will be provided upon booking, tailored to the season and local events.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="card-title border-bottom pb-3 mb-4">Photo Gallery</h3>
                  
                  <div className="row g-3">
                    <div className="col-md-12">
                      <img 
                        src={mainImageError ? fallbackImage : getTourImage(parseInt(id))} 
                        alt={tour.title} 
                        className="img-fluid rounded w-100 mb-3"
                        style={{ height: '300px', objectFit: 'cover' }}
                        onError={handleMainImageError}
                      />
                    </div>
                    
                    {galleryImages.map((img, index) => (
                      <div className="col-md-4" key={index}>
                        <img 
                          src={galleryImageErrors[index] ? fallbackImage : img} 
                          alt={`${tour.location} scene ${index + 1}`} 
                          className="img-fluid rounded"
                          style={{ 
                            height: '200px', 
                            width: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          onError={() => handleGalleryImageError(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body p-4">
                <h3 className="card-title text-center mb-4">
                  <span className="fs-5 text-muted">From</span> 
                  <br />
                  <span className="display-5 fw-bold">${tour.price}</span>
                  <span className="fs-6 text-muted"> / person</span>
                </h3>
                
                <hr />
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Group Discount:</span>
                  <span className="badge bg-success">Save 10% for 4+ people</span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Rating:</span>
                  <span>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-half text-warning"></i>
                    <span className="ms-1">(48 reviews)</span>
                  </span>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <Link 
                    to={`/booking/${tour.id}`} 
                    className="btn btn-primary btn-lg btn-animated"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Book Now
                  </Link>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-share me-2"></i>
                    Share This Tour
                  </button>
                </div>
                
                <hr className="my-4" />
                
                <div className="small text-muted">
                  <div className="mb-3">
                    <i className="bi bi-clock-history me-2 text-primary"></i>
                    <strong>Duration:</strong> {tour.duration} days
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-people me-2 text-primary"></i>
                    <strong>Group Size:</strong> 2-12 people
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    <strong>Available:</strong> Year-round
                  </div>
                  <div>
                    <i className="bi bi-translate me-2 text-primary"></i>
                    <strong>Languages:</strong> English, Spanish
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="bg-light p-3 rounded">
                  <p className="mb-2">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    <strong>Free cancellation</strong> up to 24 hours before the tour
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-credit-card me-2 text-success"></i>
                    <strong>Reserve now & pay later</strong> to book your spot without payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 