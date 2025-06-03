import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import the image utility function
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
  
  // Use modulo to ensure we don't go out of bounds
  const index = (id - 1) % images.length;
  return images[index];
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    participants: 1,
    specialRequests: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  // Generate dates for next 3 months with random available spots
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();
      
      // Generate dates for the next 3 months
      for (let i = 1; i <= 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Only include some dates (random selection)
        if (Math.random() > 0.6) {
          const availableSpots = Math.floor(Math.random() * 8) + 1; // 1-8 available spots
          dates.push({
            date: date.toISOString().split('T')[0],
            availableSpots
          });
        }
      }
      
      setAvailableDates(dates);
    };
    
    generateAvailableDates();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo({
      ...bookingInfo,
      [name]: value
    });
    
    // When date changes, find and set the selected date info
    if (name === 'date') {
      const dateInfo = availableDates.find(d => d.date === value);
      setSelectedDateInfo(dateInfo);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setSubmitted(true);
    
    // Get user from localStorage if available
    const loggedInUser = localStorage.getItem('user');
    let userId = null;
    
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      userId = userData.id;
    }
    
    // Call our API to save the booking to MongoDB
    axios.post('/api/bookings', {
      tourId: id,
      ...bookingInfo,
      tourTitle: tour.title,
      tourLocation: tour.location,
      price: tour.price,
      totalPrice: bookingInfo.participants >= 4 
        ? (tour.price * bookingInfo.participants * 0.9) 
        : (tour.price * bookingInfo.participants),
      bookingDate: new Date().toISOString(),
      userId: userId,  // Add user ID if available
      userEmail: bookingInfo.email // Store email for non-logged in bookings
    })
    .then(response => {
      // On successful booking, navigate to confirmation page
      setTimeout(() => {
        navigate('/booking-confirmation', { 
          state: { 
            tour, 
            bookingInfo,
            bookingId: response.data.data.booking._id,
            emailPreviewUrl: response.data.data.emailPreviewUrl
          } 
        });
      }, 1500);
    })
    .catch(err => {
      setError('Failed to save booking. Please try again.');
      setSubmitted(false);
      console.error('Error saving booking:', err);
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tour information...</p>
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

  if (submitted) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Processing booking...</span>
        </div>
        <p className="mt-3 lead">Processing your booking. Please wait...</p>
      </div>
    );
  }

  // Group the available dates by month
  const datesByMonth = availableDates.reduce((acc, dateInfo) => {
    const month = dateInfo.date.substring(0, 7); // YYYY-MM format
    if (!acc[month]) acc[month] = [];
    acc[month].push(dateInfo);
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <div 
        className="hero-section" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getTourImage(parseInt(id))})`,
          height: '30vh'
        }}
      >
        <div className="hero-overlay d-flex align-items-center">
          <div className="container hero-text">
            <h1 className="display-5 fw-bold">Book Your Tour</h1>
            <p className="lead text-white mb-0">Fill in your details to book {tour.title}</p>
          </div>
        </div>
      </div>

      <div className="container my-5 detail-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="alert alert-info mb-4">
              <i className="bi bi-info-circle me-2"></i>
              You're booking: <strong>{tour.title}</strong> ({tour.location})
            </div>
            
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={bookingInfo.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={bookingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={bookingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="participants" className="form-label">Number of Participants *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-people"></i>
                    </span>
                    <select
                      className="form-select"
                      id="participants"
                      name="participants"
                      value={bookingInfo.participants}
                      onChange={handleInputChange}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="date" className="form-label">Tour Date *</label>
                <div className="card border shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-calendar3 text-primary fs-4 me-2"></i>
                      <h5 className="card-title mb-0">Select your preferred date</h5>
                    </div>
                    
                    {Object.keys(datesByMonth).length > 0 ? (
                      <div className="date-selector">
                        {Object.keys(datesByMonth).sort().map(month => {
                          const monthName = new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
                          
                          return (
                            <div key={month} className="mb-4">
                              <h6 className="text-muted mb-3">{monthName}</h6>
                              <div className="date-grid">
                                {datesByMonth[month].map(dateInfo => {
                                  const day = new Date(dateInfo.date).getDate();
                                  const dayName = new Date(dateInfo.date).toLocaleString('default', { weekday: 'short' });
                                  
                                  return (
                                    <div key={dateInfo.date} className="date-option">
                                      <input
                                        type="radio"
                                        className="btn-check"
                                        name="date"
                                        id={`date-${dateInfo.date}`}
                                        value={dateInfo.date}
                                        checked={bookingInfo.date === dateInfo.date}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <label 
                                        className={`btn btn-outline-primary date-btn w-100 ${dateInfo.availableSpots < bookingInfo.participants ? 'disabled' : ''}`} 
                                        htmlFor={`date-${dateInfo.date}`}
                                        title={dateInfo.availableSpots < bookingInfo.participants ? 'Not enough spots available' : ''}
                                      >
                                        <div className="small mb-1">{dayName}</div>
                                        <div className="fw-bold">{day}</div>
                                        <div className="small mt-1">
                                          {dateInfo.availableSpots} {dateInfo.availableSpots === 1 ? 'spot' : 'spots'}
                                        </div>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-calendar-x fs-1"></i>
                        <p className="mt-2">No available dates found for this tour</p>
                      </div>
                    )}
                    
                    {bookingInfo.date && selectedDateInfo && (
                      <div className="alert alert-success mt-3">
                        <i className="bi bi-check-circle me-2"></i>
                        You've selected <strong>{new Date(bookingInfo.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> with {selectedDateInfo.availableSpots} available spot(s).
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="specialRequests" className="form-label">Special Requests</label>
                <textarea
                  className="form-control"
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  value={bookingInfo.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or dietary requirements"
                ></textarea>
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to={`/tours/${id}`} className="btn btn-outline-secondary me-md-2">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Tour
                </Link>
                <button type="submit" className="btn btn-primary btn-animated">
                  <i className="bi bi-check-circle me-2"></i>
                  Complete Booking
                </button>
              </div>
            </form>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <img 
                src={getTourImage(parseInt(id))} 
                className="card-img-top" 
                alt={tour.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 className="card-title">Booking Summary</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Tour:</span>
                  <span className="fw-bold">{tour.title}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Location:</span>
                  <span>{tour.location}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Duration:</span>
                  <span>{tour.duration} days</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Price per person:</span>
                  <span>${tour.price}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Participants:</span>
                  <span>{bookingInfo.participants}</span>
                </div>
                
                {bookingInfo.participants >= 4 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Group Discount (10%):</span>
                    <span>-${(tour.price * bookingInfo.participants * 0.1).toFixed(2)}</span>
                  </div>
                )}
                
                {bookingInfo.date && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Date:</span>
                    <span>{new Date(bookingInfo.date).toLocaleDateString()}</span>
                  </div>
                )}
                
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total:</strong>
                  <strong className="fs-5 text-primary">${bookingInfo.participants >= 4 
                    ? (tour.price * bookingInfo.participants * 0.9).toFixed(2) 
                    : (tour.price * bookingInfo.participants).toFixed(2)}</strong>
                </div>
                <div className="small text-muted mt-3">
                  <div className="mb-2">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    Free cancellation up to 24 hours before the tour.
                  </div>
                  <div>
                    <i className="bi bi-credit-card me-2 text-success"></i>
                    Secure payment - all major credit cards accepted.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 