import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      // Use auth context register
      await register(registrationData);
      
      // Navigate to profile page
      navigate('/profile');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Background image style with a different image
  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80")',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    background: 'linear-gradient(135deg,rgb(200, 158, 8) 0%, #9b59b6 100%)',
    color: 'white',
    padding: '20px',
    borderBottom: 'none',
    textAlign: 'center',
    fontSize: '26px',
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
    padding: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
  };
  
  // Footer style
  const footerStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    borderTop: 'none',
    padding: '20px',
    textAlign: 'center',
    fontSize: '16px'
  };
  
  // Link style
  const linkStyle = {
    color: '#9b59b6',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };
  
  // Input group style
  const inputGroupStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #ced4da',
    borderRadius: '8px 0 0 8px',
    padding: '12px 15px',
  };
  
  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div>
      <Container style={contentStyle}>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={11}>
            <div className="text-center mb-4">
              <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '48px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                TourBuddy
              </h1>
              <p style={{ color: 'white', fontSize: '20px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                Start your journey with us
              </p>
            </div>
            
            <Card style={cardStyle}>
              <Card.Header style={headerStyle}>Create Your Account</Card.Header>
              <Card.Body style={formContainerStyle}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={inputGroupStyle}>
                        <i className="bi bi-person"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        style={inputStyle}
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Email address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={inputGroupStyle}>
                        <i className="bi bi-envelope"></i>
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={inputStyle}
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Phone Number</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={inputGroupStyle}>
                        <i className="bi bi-telephone"></i>
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                        style={inputStyle}
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={inputGroupStyle}>
                        <i className="bi bi-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                        minLength="6"
                        style={inputStyle}
                      />
                    </div>
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters long
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Confirm Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={inputGroupStyle}>
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        style={inputStyle}
                      />
                    </div>
                  </Form.Group>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      style={buttonStyle}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Register
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer style={footerStyle}>
                Already have an account? <Link to="/login" style={linkStyle}>Sign In</Link>
              </Card.Footer>
            </Card>
            
            <div className="text-center mt-4">
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                By creating an account, you agree to our <a href="#" style={{...linkStyle, color: 'rgba(255, 255, 255, 0.9)'}}>Terms of Service</a> and <a href="#" style={{...linkStyle, color: 'rgba(255, 255, 255, 0.9)'}}>Privacy Policy</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 