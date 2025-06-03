const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// POST - Create a new booking
router.post('/', bookingController.createBooking);

// GET - Get all bookings
router.get('/', bookingController.getAllBookings);

// GET - Get user bookings (must be before /:id route to avoid conflicts)
router.get('/user/:userId', bookingController.getUserBookings);

// POST - Cancel booking
router.post('/:id/cancel', bookingController.cancelBooking);

// GET - Get booking by ID
router.get('/:id', bookingController.getBookingById);

module.exports = router; 