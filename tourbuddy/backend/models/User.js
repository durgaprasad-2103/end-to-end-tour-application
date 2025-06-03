const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for bookings
UserSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'userId'
});

module.exports = mongoose.model('User', UserSchema); 