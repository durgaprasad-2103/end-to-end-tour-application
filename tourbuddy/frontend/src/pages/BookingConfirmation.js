import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const { tour, bookingInfo, emailPreviewUrl } = location.state || {};

  // If user navigates directly to this page without booking data, redirect to tours
  if (!tour || !bookingInfo) {
    return <Navigate to="/tours" replace />;
  }

  // Generate a random booking reference
  const bookingReference = `TB-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Format the date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-success mb-4">
            <div className="card-header bg-success text-white">
              <h3 className="m-0">Booking Confirmed!</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3">Thank you for your booking, {bookingInfo.fullName}!</h4>
                <p className="lead">Your adventure is ready to begin.</p>
                <div className="alert alert-info">
                  Booking Reference: <strong>{bookingReference}</strong>
                </div>
              </div>

              <h5>Booking Details</h5>
              <div className="row mb-4">
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Tour:</span>
                      <span className="fw-bold">{tour.title}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Location:</span>
                      <span>{tour.location}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Duration:</span>
                      <span>{tour.duration} days</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Tour Date:</span>
                      <span>{formatDate(bookingInfo.date)}</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Participants:</span>
                      <span>{bookingInfo.participants}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Price per person:</span>
                      <span>${tour.price}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total:</span>
                      <span className="fw-bold">${tour.price * bookingInfo.participants}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h5>Contact Information</h5>
              <ul className="list-group mb-4">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Name:</span>
                  <span>{bookingInfo.fullName}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Email:</span>
                  <span>{bookingInfo.email}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Phone:</span>
                  <span>{bookingInfo.phone}</span>
                </li>
              </ul>

              {bookingInfo.specialRequests && (
                <div className="mb-4">
                  <h5>Special Requests</h5>
                  <div className="card">
                    <div className="card-body">
                      {bookingInfo.specialRequests}
                    </div>
                  </div>
                </div>
              )}

              <div className="alert alert-success">
                <h5 className="alert-heading">What's Next?</h5>
                <p>A detailed confirmation email has been sent to <strong>{bookingInfo.email}</strong>.</p>
                <p>You'll receive additional information about your tour, including meeting point details and what to bring, as your tour date approaches.</p>
                <p className="mb-0">If you have any questions, please contact our customer service at support@tourbuddy.com.</p>
              </div>
              
              {emailPreviewUrl && (
                <div className="alert alert-primary">
                  <h5 className="alert-heading">View Your Confirmation Email</h5>
                  <p>Since this is a demo application, we're using Ethereal for email testing.</p>
                  <p>Click the button below to see how your confirmation email looks:</p>
                  <a 
                    href={emailPreviewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm mt-2"
                  >
                    <i className="bi bi-envelope-open me-2"></i>
                    View Email
                  </a>
                </div>
              )}
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <Link to="/tours" className="btn btn-primary">
                  Browse More Tours
                </Link>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => window.print()}
                >
                  Print Confirmation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 