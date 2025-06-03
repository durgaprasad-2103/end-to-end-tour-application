const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  tourId: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true
  },
  phone: {
    type: String
  },
  date: {
    type: Date,
    required: [true, 'Please provide booking date']
  },
  participants: {
    type: Number,
    required: [true, 'Please provide number of participants'],
    min: [1, 'Must have at least 1 participant']
  },
  specialRequests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema); 