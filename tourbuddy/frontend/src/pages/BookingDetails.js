import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useReactToPrint } from 'react-to-print';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');
  
  // Ref for printing
  const printRef = useRef();
  
  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Booking_${id}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        resolve();
      });
    },
    onAfterPrint: () => {
      console.log('Print completed');
    }
  });
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/bookings/${id}`
        );
        setBooking(response.data.data.booking);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details');
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id, user, navigate]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  // Handle cancel booking
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    setCancelError('');
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/bookings/${id}/cancel`
      );
      
      setCancelSuccess(true);
      
      // Update the booking status in the state
      setBooking(prev => ({
        ...prev,
        status: 'cancelled'
      }));
      
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setCancelError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };
  
  // Background image style
  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    paddingTop: '50px',
    paddingBottom: '50px'
  };
  
  // Overlay style
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  };
  
  // Content style
  const contentStyle = {
    position: 'relative',
    zIndex: 2
  };
  
  // Container style for loading
  const loadingContainerStyle = {
    position: 'relative',
    zIndex: 2,
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  // Card style
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRadius: '15px',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden'
  };
  
  // Header style
  const headerStyle = {
    background: 'linear-gradient(135deg, #4a90e2 0%, #9b59b6 100%)',
    color: 'white',
    padding: '20px',
    borderBottom: 'none',
    fontSize: '22px',
    fontWeight: 'bold'
  };
  
  // Button style
  const buttonStyle = {
    background: 'linear-gradient(135deg, #4a90e2 0%, #9b59b6 100%)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  };
  
  if (loading) {
    return (
      <div style={backgroundStyle}>
        <div style={overlayStyle}></div>
        <Container style={loadingContainerStyle}>
          <div className="text-center">
            <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-white fs-5">Loading booking details...</p>
          </div>
        </Container>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={backgroundStyle}>
        <div style={overlayStyle}></div>
        <Container style={contentStyle} className="py-5">
          <Card style={cardStyle}>
            <Card.Body className="text-center py-5">
              <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">Error Loading Booking</h3>
              <Alert variant="danger" className="mx-auto mt-3" style={{ maxWidth: '500px' }}>
                {error}
              </Alert>
              <Button 
                variant="primary" 
                className="mt-3" 
                onClick={() => navigate('/profile')}
                style={buttonStyle}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Profile
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div style={backgroundStyle}>
        <div style={overlayStyle}></div>
        <Container style={contentStyle} className="py-5">
          <Card style={cardStyle}>
            <Card.Body className="text-center py-5">
              <i className="bi bi-calendar-x text-warning" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">Booking Not Found</h3>
              <p className="text-muted">We couldn't find the booking you're looking for.</p>
              <Button 
                variant="primary" 
                className="mt-3" 
                onClick={() => navigate('/profile')}
                style={buttonStyle}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Profile
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
  
  return (
    <>
      <div style={backgroundStyle}>
        <div style={overlayStyle}></div>
        <Container style={contentStyle} className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white m-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Booking Details</h2>
            <Button 
              variant="outline-light" 
              onClick={() => navigate('/profile')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Profile
            </Button>
          </div>
          
          <div ref={printRef}>
            <Card style={cardStyle} className="mb-4">
              <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  Booking #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                </h4>
                <Badge 
                  bg={
                    booking.status === 'confirmed' ? 'success' : 
                    booking.status === 'cancelled' ? 'danger' : 'secondary'
                  }
                  style={{ fontSize: '14px', padding: '8px 12px' }}
                >
                  {booking.status.toUpperCase()}
                </Badge>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="g-0">
                  {booking.tour?.image && (
                    <Col md={4} className="d-none d-md-block">
                      <div 
                        style={{
                          backgroundImage: `url(${booking.tour.image})`, 
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          height: '100%',
                          minHeight: '250px'
                        }}
                      />
                    </Col>
                  )}
                  <Col md={booking.tour?.image ? 8 : 12}>
                    <div className="p-4">
                      <h3 className="mb-1" style={{ color: '#4a4a4a' }}>{booking.tour?.title || 'Tour'}</h3>
                      <p className="text-muted mb-3">
                        <i className="bi bi-geo-alt me-1"></i>
                        {booking.tour?.location || 'Location information not available'}
                      </p>
                      
                      <hr />
                      
                      <Row className="mb-3">
                        <Col sm={4}><strong>Booking Date:</strong></Col>
                        <Col sm={8}>
                          <span className="text-primary">
                            <i className="bi bi-calendar-date me-2"></i>
                            {formatDate(booking.date)}
                          </span>
                        </Col>
                      </Row>
                      
                      <Row className="mb-3">
                        <Col sm={4}><strong>Participants:</strong></Col>
                        <Col sm={8}>
                          <i className="bi bi-people me-2"></i>
                          {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                        </Col>
                      </Row>
                      
                      {booking.tour && (
                        <>
                          <Row className="mb-3">
                            <Col sm={4}><strong>Tour Duration:</strong></Col>
                            <Col sm={8}>
                              <i className="bi bi-clock me-2"></i>
                              {booking.tour.duration} {booking.tour.duration === 1 ? 'day' : 'days'}
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col sm={4}><strong>Tour Price:</strong></Col>
                            <Col sm={8}>
                              <i className="bi bi-tag me-2"></i>
                              ${booking.tour.price} per person
                            </Col>
                          </Row>
                          
                          <Row className="mb-3">
                            <Col sm={4}><strong>Total Amount:</strong></Col>
                            <Col sm={8}>
                              <span className="fw-bold" style={{ color: '#4a90e2' }}>
                                <i className="bi bi-cash me-2"></i>
                                ${booking.tour.price * booking.participants}
                              </span>
                            </Col>
                          </Row>
                        </>
                      )}
                      
                      {booking.specialRequests && (
                        <Row className="mb-3">
                          <Col sm={4}><strong>Special Requests:</strong></Col>
                          <Col sm={8}>
                            <i className="bi bi-chat-left-text me-2"></i>
                            {booking.specialRequests}
                          </Col>
                        </Row>
                      )}
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Booked On:</strong></Col>
                        <Col sm={8}>
                          <i className="bi bi-calendar me-2"></i>
                          {formatDate(booking.createdAt)} at {formatTime(booking.createdAt)}
                        </Col>
                      </Row>
                    </div>
                    
                    <Card className="mx-4 mb-4 border-primary" style={{ borderRadius: '10px' }}>
                      <Card.Header className="bg-primary text-white">
                        <i className="bi bi-person-badge me-2"></i>
                        Contact Information
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-2">
                          <strong><i className="bi bi-person me-2"></i>Name:</strong><br />
                          {booking.fullName}
                        </p>
                        <p className="mb-2">
                          <strong><i className="bi bi-envelope me-2"></i>Email:</strong><br />
                          {booking.email}
                        </p>
                        {booking.phone && (
                          <p className="mb-0">
                            <strong><i className="bi bi-telephone me-2"></i>Phone:</strong><br />
                            {booking.phone}
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                    
                    <div className="d-flex px-4 pb-4 justify-content-between d-print-none">
                      {booking.status === 'confirmed' && new Date(booking.date) > new Date() && (
                        <Button 
                          variant="danger" 
                          className="d-flex align-items-center"
                          onClick={() => setShowCancelModal(true)}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel Booking
                        </Button>
                      )}
                      <Button 
                        variant="primary" 
                        className="ms-auto d-flex align-items-center"
                        onClick={handlePrint}
                        style={buttonStyle}
                      >
                        <i className="bi bi-printer me-2"></i>
                        Print Booking Details
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
      
      {/* Cancel Booking Modal */}
      <Modal show={showCancelModal} onHide={() => !cancelLoading && setShowCancelModal(false)}>
        <Modal.Header closeButton style={headerStyle}>
          <Modal.Title><i className="bi bi-exclamation-triangle me-2"></i>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancelSuccess ? (
            <Alert variant="success">
              <h5><i className="bi bi-check-circle me-2"></i>Booking Cancelled Successfully</h5>
              <p>Your booking has been cancelled. A confirmation email will be sent to your registered email address.</p>
            </Alert>
          ) : (
            <>
              {cancelError && <Alert variant="danger">{cancelError}</Alert>}
              <p>Are you sure you want to cancel this booking?</p>
              <div className="card p-3 bg-light">
                <p className="mb-1"><strong>Tour:</strong> {booking.tour?.title}</p>
                <p className="mb-1"><strong>Date:</strong> {formatDate(booking.date)}</p>
                <p className="mb-0"><strong>Participants:</strong> {booking.participants}</p>
              </div>
              <Alert variant="warning" className="mt-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                This action cannot be undone. Please contact customer support if you cancel by mistake.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {cancelSuccess ? (
            <Button 
              variant="primary" 
              onClick={() => navigate('/profile')}
              style={buttonStyle}
            >
              Back to Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                No, Keep Booking
              </Button>
              <Button 
                variant="danger" 
                onClick={handleCancelBooking}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookingDetails; 