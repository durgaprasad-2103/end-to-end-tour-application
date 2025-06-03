import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Spinner } from 'react-bootstrap';

const UserPoints = ({ userId }) => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/users/${userId}/points`);
        setPoints(response.data.data.points);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user points:', err);
        setError('Failed to load your loyalty points');
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading points...
      </div>
    );
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  if (!userId) {
    return null;
  }

  return (
    <Card className="mb-3 bg-light">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="position-relative">
            <i className="bi bi-star-fill text-warning" style={{ fontSize: '2rem' }}></i>
            <Badge 
              bg="primary" 
              pill
              className="position-absolute top-0 start-100 translate-middle"
            >
              {points}
            </Badge>
          </div>
          <div className="ms-3">
            <h5 className="mb-1">Loyalty Points</h5>
            <p className="text-muted mb-0">
              {points === 0 ? 
                'Book a tour to earn points!' : 
                `You have ${points} points to use for future discounts!`}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserPoints; 