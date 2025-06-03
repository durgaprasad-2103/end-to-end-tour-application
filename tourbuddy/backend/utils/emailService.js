const nodemailer = require('nodemailer');

// Create a transporter with an Ethereal test account
let transporter;

// Create test account and transporter
const createTransporter = async () => {
  if (transporter) return transporter;
  
  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    // Create reusable transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Ethereal test account created:', testAccount.user);
    return transporter;
  } catch (error) {
    console.error('Failed to create test email account:', error);
    
    // Fallback to dummy transporter if creation fails
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpassword'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    return transporter;
  }
};

// Format the date for better display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Send a booking confirmation email
 * @param {Object} booking - The booking object with all details
 * @param {Object} tour - The tour details
 * @returns {Promise} - Resolves with info about the sent email
 */
exports.sendBookingConfirmation = async (booking, tour) => {
  try {
    // Create or get transporter
    const mailTransporter = await createTransporter();
    
    // Create email content
    const mailOptions = {
      from: '"TourBuddy" <bookings@tourbuddy.com>',
      to: booking.email,
      subject: `Booking Confirmation - ${tour.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">Your Trip is Booked!</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p><strong>Booking ID:</strong> #${booking._id}</p>
            <p><strong>Tour:</strong> ${tour.title}</p>
            <p><strong>Location:</strong> ${tour.location}</p>
            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>Number of Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Price:</strong> $${tour.price * booking.guests}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #333;">Customer Information</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #777; font-size: 14px;">
            <p>Thank you for choosing TourBuddy. We look forward to providing you with an amazing experience!</p>
            <p>If you have any questions, please reply to this email or call us at +1-123-456-7890.</p>
          </div>
        </div>
      `
    };

    // Send the email
    const info = await mailTransporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    // Generate and log the preview URL for testing
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL: %s', previewUrl);
    
    // Add the preview URL to the info object
    return {
      ...info,
      previewUrl
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};