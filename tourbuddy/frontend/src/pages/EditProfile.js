import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user, updateUserDetails } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/${user._id}`,
        formData
      );
      
      setSuccess('Profile updated successfully');
      
      // Get updated user from response
      const updatedUser = response.data.data.user;
      
      // Update user in localStorage and auth context
      if (updateUserDetails) {
        updateUserDetails({
          ...user,
          name: updatedUser.name,
          phone: updatedUser.phone
        });
      } else {
        // Fallback if updateUserDetails is not available
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            name: updatedUser.name,
            phone: updatedUser.phone
          }));
        }
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Background image style
  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1574237184559-8c03f641a9e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    paddingTop: '50px',
    paddingBottom: '50px'
  };
  
  // Overlay style for better text visibility
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  };
  
  // Content style
  const contentStyle = {
    position: 'relative',
    zIndex: 2
  };
  
  // Card style
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  };
  
  // Form container style
  const formContainerStyle = {
    padding: '30px 40px'
  };
  
  // Input style
  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    padding: '12px 15px',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  };
  
  // Button style
  const buttonStyle = {
    background: 'linear-gradient(135deg, #4a90e2 0%, #9b59b6 100%)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  };
  
  // If no user, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div>
      <Container style={contentStyle}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4">
              <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '42px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                Edit Your Profile
              </h1>
            </div>
            
            <Card style={cardStyle}>
              <Card.Header style={headerStyle}>
                <i className="bi bi-person-circle me-2"></i>
                Update Your Details
              </Card.Header>
              <Card.Body style={formContainerStyle}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      disabled
                      style={{...inputStyle, backgroundColor: '#f8f9fa'}}
                    />
                    <Form.Text className="text-muted">
                      Email address cannot be changed
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      style={inputStyle}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/profile')}
                      style={{ borderRadius: '8px', padding: '10px 20px' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      style={buttonStyle}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile; 