import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fade-in">
      <section 
        className="hero-section" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-text">
            <h1 className="display-3 fw-bold mb-4">Welcome to TourBuddy</h1>
            <p className="lead fs-4 mb-5">
              Discover amazing tours and travel experiences around the world.
              Plan your next adventure with our curated selection of tours.
            </p>
            <Link to="/tours" className="btn btn-primary btn-lg btn-animated px-5 py-3">
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
      
      <section className="container my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Why Choose Us</h2>
          <p className="lead text-muted">We make your travel experience unforgettable</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-4">
                  <i className="bi bi-compass fs-1 text-primary"></i>
                </div>
                <h3 className="card-title h4">Discover</h3>
                <p className="card-text">
                  Find the perfect tour that matches your interests and budget.
                  We offer a wide range of destinations and experiences.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-4">
                  <i className="bi bi-calendar-check fs-1 text-primary"></i>
                </div>
                <h3 className="card-title h4">Book</h3>
                <p className="card-text">
                  Easy and secure booking process with instant confirmation.
                  Flexible payment options and free cancellation policy.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="mb-4">
                  <i className="bi bi-emoji-smile fs-1 text-primary"></i>
                </div>
                <h3 className="card-title h4">Enjoy</h3>
                <p className="card-text">
                  Create unforgettable memories with our guided tours.
                  Professional guides and seamless travel experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80" 
                alt="Travel experiences" 
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold mb-4">Unforgettable Experiences</h2>
              <p className="lead mb-4">
                Our tours are designed to provide you with unique and authentic experiences 
                that you'll remember for a lifetime.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Expert local guides who know the hidden gems
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Small groups for a more personalized experience
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Carefully selected accommodations and restaurants
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  24/7 support during your entire journey
                </li>
              </ul>
              <Link to="/tours" className="btn btn-outline-primary mt-4 btn-lg">
                View All Tours
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container text-center py-5 my-5">
        <h2 className="display-6 fw-bold mb-5">Start Your Adventure Today</h2>
        <Link to="/tours" className="btn btn-primary btn-lg px-5 py-3 btn-animated">
          Browse Available Tours
        </Link>
      </section>
    </div>
  );
};

export default Home; 