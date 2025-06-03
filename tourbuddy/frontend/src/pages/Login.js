import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Use auth context login
      await login(formData.email, formData.password);
      
      // Redirect to profile
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Background image style
  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80")',
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
  
  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}></div>
      <Container style={contentStyle}>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={10}>
            <div className="text-center mb-5">
              <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '48px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                TourBuddy
              </h1>
              <p style={{ color: 'white', fontSize: '20px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                Your ultimate travel companion
              </p>
            </div>
            
            <Card style={cardStyle}>
              <Card.Header style={headerStyle}>Welcome Back</Card.Header>
              <Card.Body style={formContainerStyle}>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between">
                      <Form.Label style={{ fontWeight: '600', fontSize: '16px' }}>Password</Form.Label>
                      <Link to="/forgot-password" style={linkStyle}>Forgot Password?</Link>
                    </div>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      style={buttonStyle}
                      className="btn-hover"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer style={footerStyle}>
                Don't have an account? <Link to="/register" style={linkStyle}>Create an account</Link>
              </Card.Footer>
            </Card>
            
            <div className="text-center mt-4">
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                By signing in, you agree to our <a href="#" style={{...linkStyle, color: 'rgba(255, 255, 255, 0.9)'}}>Terms of Service</a> and <a href="#" style={{...linkStyle, color: 'rgba(255, 255, 255, 0.9)'}}>Privacy Policy</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 