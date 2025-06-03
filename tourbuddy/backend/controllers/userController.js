const User = require('../models/User');
const Booking = require('../models/Booking');
const { tours } = require('./tourController');
const crypto = require('crypto');

// Generate a random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calculate points for a booking
const calculatePoints = (price) => {
  // Award 1 point for every $10 spent, rounded down
  return Math.floor(price / 10);
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Generate auth token
    const token = generateToken();
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password, // In a real app, you would hash this password
      phone,
      token,
      points: 0
    });
    
    // Create a user object without the password to return
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    
    return res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to register user'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Generate new token for this session
    const token = generateToken();
    
    // Update user with new token
    user.token = token;
    await user.save();
    
    // Create a user object without the password to return
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    return res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to login'
    });
  }
};

// Verify token and get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }
    
    // Find user by token
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate user'
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Clear the token
    await User.findByIdAndUpdate(userId, { token: null });
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to logout'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is required'
      });
    }
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Get user bookings by ID
    let userBookings = await Booking.find({ userId });
    
    // Also check for bookings by email (for bookings made before user was registered)
    const emailBookings = await Booking.find({ email: user.email });
    
    // Combine bookings and remove duplicates
    const allBookings = [...userBookings, ...emailBookings];
    const uniqueBookingIds = [...new Set(allBookings.map(b => b._id.toString()))];
    const uniqueBookings = uniqueBookingIds.map(bookingId => {
      const booking = allBookings.find(b => b._id.toString() === bookingId);
      const tourId = parseInt(booking.tourId);
      const tour = tours.find(t => t.id === tourId);
      return {
        ...booking.toObject(),
        tour: tour || { title: 'Unknown Tour' }
      };
    });
    
    return res.status(200).json({
      status: 'success',
      data: {
        user,
        bookings: uniqueBookings
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is required'
      });
    }
    
    const { name, phone } = req.body;
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { name, phone },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

// Get user's loyalty points
exports.getUserPoints = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        points: user.points
      }
    });
  } catch (error) {
    console.error('Error getting user points:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user points'
    });
  }
};

// For development - get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    return res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get users'
    });
  }
}; 