import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UserPoints from '../components/UserPoints';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile and bookings
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/${user._id}`);
        setBookings(response.data.data.bookings || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    if (user && user._id) {
      fetchUserProfile();
    }
  }, [user, isAuthenticated, navigate]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!user) return <Container className="my-5"><Alert variant="info">Please log in to view your profile</Alert></Container>;
  
  return (
    <Container className="my-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=96`} 
                  alt="User Avatar" 
                  className="rounded-circle" 
                  width="96" 
                  height="96" 
                />
              </div>
              <h4 className="card-title mb-0">{user.name}</h4>
              <p className="text-muted">{user.email}</p>
              <p>
                <i className="bi bi-telephone me-2"></i>
                {user.phone || 'No phone number'}
              </p>
              <hr />
              
              {/* Display user points */}
              <UserPoints userId={user._id} />
              
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => navigate('/profile/edit')}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="mb-0">My Bookings</h4>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading your bookings...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : bookings.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-calendar3 display-4 text-muted"></i>
                  <p className="mt-3">You haven't made any bookings yet.</p>
                  <Button variant="primary" onClick={() => navigate('/tours')}>
                    Browse Tours
                  </Button>
                </div>
              ) : (
                <Tabs defaultActiveKey="upcoming" className="mb-3">
                  <Tab eventKey="upcoming" title="Upcoming">
                    {bookings
                      .filter(booking => new Date(booking.date) >= new Date())
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(booking => (
                        <Card key={booking._id} className="mb-3">
                          <Card.Body>
                            <Row>
                              <Col md={8}>
                                <h5>{booking.tour?.title || 'Tour'}</h5>
                                <p className="mb-1">
                                  <strong>Date:</strong> {formatDate(booking.date)}
                                </p>
                                <p className="mb-1">
                                  <strong>Participants:</strong> {booking.participants}
                                </p>
                                <p className="mb-0">
                                  <strong>Status:</strong> {' '}
                                  <span className="badge bg-success">{booking.status}</span>
                                </p>
                              </Col>
                              <Col md={4} className="text-end">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => navigate(`/booking-details/${booking._id}`)}
                                >
                                  View Details
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                  </Tab>
                  <Tab eventKey="past" title="Past">
                    {bookings
                      .filter(booking => new Date(booking.date) < new Date())
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(booking => (
                        <Card key={booking._id} className="mb-3">
                          <Card.Body>
                            <Row>
                              <Col md={8}>
                                <h5>{booking.tour?.title || 'Tour'}</h5>
                                <p className="mb-1">
                                  <strong>Date:</strong> {formatDate(booking.date)}
                                </p>
                                <p className="mb-1">
                                  <strong>Participants:</strong> {booking.participants}
                                </p>
                                <p className="mb-0">
                                  <strong>Status:</strong> {' '}
                                  <span className="badge bg-secondary">{booking.status}</span>
                                </p>
                              </Col>
                              <Col md={4} className="text-end">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => navigate(`/booking-details/${booking._id}`)}
                                >
                                  View Details
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                  </Tab>
                </Tabs>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 