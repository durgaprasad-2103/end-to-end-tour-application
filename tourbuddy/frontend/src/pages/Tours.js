import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourCard from '../components/TourCard';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/api/tours');
        setTours(response.data.data.tours);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
        setLoading(false);
        console.error('Error fetching tours:', err);
      }
    };

    fetchTours();
  }, []);

  // Filter tours based on price range
  const getFilteredTours = () => {
    let filteredTours = [...tours];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      filteredTours = filteredTours.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    if (filter === 'budget') {
      filteredTours = filteredTours.filter(tour => tour.price < 300);
    } else if (filter === 'mid') {
      filteredTours = filteredTours.filter(tour => tour.price >= 300 && tour.price <= 500);
    } else if (filter === 'luxury') {
      filteredTours = filteredTours.filter(tour => tour.price > 500);
    }
    
    return filteredTours;
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tours...</p>
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

  const filteredTours = getFilteredTours();

  return (
    <div className="fade-in">
      <div className="bg-light py-5 mb-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Our Tours</h1>
          <p className="lead">Discover unforgettable experiences and adventures around the world</p>
          
          <div className="row mt-4">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search tours or destinations..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={filter} 
                onChange={handleFilterChange}
                aria-label="Filter by price"
              >
                <option value="all">All Price Ranges</option>
                <option value="budget">Budget (Under $300)</option>
                <option value="mid">Mid-range ($300-$500)</option>
                <option value="luxury">Luxury (Over $500)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mb-5">
        <div className="row">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour, index) => (
              <div 
                className="col-md-6 col-lg-4 mb-4" 
                key={tour.id}
                style={{ 
                  animation: `fadeIn 0.5s ease-in forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0 
                }}
              >
                <TourCard tour={tour} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">No tours found</h3>
              <p className="text-muted">
                Try adjusting your search or filter to find tours.
              </p>
              <button 
                className="btn btn-outline-primary mt-2" 
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours; 