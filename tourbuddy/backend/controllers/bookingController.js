const Booking = require('../models/Booking');
const User = require('../models/User');
const { tours } = require('./tourController');
const emailService = require('../utils/emailService');

// Calculate points for a booking
const calculatePoints = (price) => {
  // Award 1 point for every $10 spent, rounded down
  return Math.floor(price / 10);
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    // Get booking data from request body
    const bookingData = req.body;
    
    // Create a new booking in database
    const newBooking = await Booking.create({
      ...bookingData,
      status: 'confirmed'
    });
    
    // Find the associated tour from in-memory data
    const tourId = parseInt(bookingData.tourId);
    const tour = tours.find(t => t.id === tourId);
    
    // Add points to user if userId is provided
    if (bookingData.userId && tour) {
      try {
        const pointsEarned = calculatePoints(tour.price);
        
        // Update user's points
        await User.findByIdAndUpdate(
          bookingData.userId,
          { $inc: { points: pointsEarned } }
        );
        
        console.log(`Added ${pointsEarned} points to user ${bookingData.userId}`);
      } catch (pointsError) {
        console.error('Failed to add points:', pointsError);
        // Continue processing - don't fail the booking just because points update failed
      }
    }
    
    let emailPreviewUrl = null;
    
    if (tour && bookingData.email) {
      try {
        // Send confirmation email
        // Map frontend property names to names expected by email service
        const emailBooking = {
          _id: newBooking._id,
          name: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          date: bookingData.date,
          guests: bookingData.participants,
          specialRequests: bookingData.specialRequests
        };
        
        // Create tour object in format expected by email service
        const emailTour = {
          title: tour.title,
          location: tour.location,
          price: tour.price,
          duration: tour.duration
        };
        
        const emailInfo = await emailService.sendBookingConfirmation(emailBooking, emailTour);
        emailPreviewUrl = emailInfo.previewUrl;
        console.log(`Confirmation email sent to ${bookingData.email}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // We continue processing - don't fail the booking just because email failed
      }
    }
    
    // Return success response
    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking,
        emailPreviewUrl: emailPreviewUrl
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create booking'
    });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    
    // Enrich bookings with tour details from in-memory data
    const enrichedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      const tourId = parseInt(booking.tourId);
      const tour = tours.find(t => t.id === tourId);
      return {
        ...bookingObj,
        tour: tour || { title: 'Unknown Tour' }
      };
    });
    
    res.status(200).json({
      status: 'success',
      results: enrichedBookings.length,
      data: {
        bookings: enrichedBookings
      }
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get bookings'
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }
    
    // Get associated tour from in-memory data
    const tourId = parseInt(booking.tourId);
    const tour = tours.find(t => t.id === tourId);
    
    const bookingWithTour = {
      ...booking.toObject(),
      tour: tour || { title: 'Unknown Tour' }
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        booking: bookingWithTour
      }
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get booking'
    });
  }
};

// Cancel booking by ID
exports.cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'fail',
        message: 'Booking is already cancelled'
      });
    }
    
    // Check if booking date is in the past
    if (new Date(booking.date) < new Date()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot cancel a booking that has already occurred'
      });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    // Get associated tour from in-memory data
    const tourId = parseInt(booking.tourId);
    const tour = tours.find(t => t.id === tourId);
    
    // Send cancellation email (if email service is available)
    if (emailService.sendBookingCancellation && booking.email) {
      try {
        await emailService.sendBookingCancellation(booking, tour);
        console.log(`Cancellation email sent to ${booking.email}`);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        // We continue processing - don't fail just because email failed
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        booking: booking
      }
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel booking'
    });
  }
};

// Get bookings by user ID (API endpoint)
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find bookings for this user
    const userBookings = await Booking.find({ userId });
    
    // Enrich bookings with tour details from in-memory data
    const enrichedBookings = userBookings.map(booking => {
      const bookingObj = booking.toObject();
      const tourId = parseInt(booking.tourId);
      const tour = tours.find(t => t.id === tourId);
      return {
        ...bookingObj,
        tour: tour || { title: 'Unknown Tour' }
      };
    });
    
    res.status(200).json({
      status: 'success',
      results: enrichedBookings.length,
      data: {
        bookings: enrichedBookings
      }
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user bookings'
    });
  }
}; 