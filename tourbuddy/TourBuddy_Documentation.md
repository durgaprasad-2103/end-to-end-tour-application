# TourBuddy - Travel Booking and Management System

## Project Overview

TourBuddy is a full-stack web application that allows users to browse, book, and manage tours and travel experiences. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and follows a modern, responsive design approach.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Key Features](#key-features)
5. [Database Models](#database-models)
6. [Authentication Flow](#authentication-flow)
7. [API Endpoints](#api-endpoints)
8. [Component Hierarchy](#component-hierarchy)
9. [Styling and UI Design](#styling-and-ui-design)
10. [Deployment](#deployment)

## Project Structure

The project follows a client-server architecture with separate frontend and backend codebases:

```
tourbuddy/
├── frontend/          # React frontend application
├── backend/           # Node.js & Express backend API
├── package.json       # Root package.json for project-wide scripts
└── README.md          # Project documentation
```

## Frontend Architecture

The frontend is built with React.js and uses React Router for navigation, Bootstrap for styling, and Context API for state management.

### Key Frontend Files and Directories:

- **src/App.js**: Main component that sets up routing and navigation
- **src/context/AuthContext.js**: Authentication context for user management
- **src/services/authService.js**: Service for authentication API calls
- **src/pages/**: Contains all page-level components
- **src/components/**: Contains reusable UI components

### Pages:

1. **Home.js**: Landing page with featured tours and promotional content
2. **Tours.js**: List of available tours
3. **TourDetails.js**: Detailed view of a single tour
4. **Booking.js**: Tour booking form
5. **BookingConfirmation.js**: Confirmation page after successful booking
6. **BookingDetails.js**: Display details of a specific booking
7. **Login.js**: User login page
8. **Register.js**: User registration page
9. **Profile.js**: User profile page
10. **EditProfile.js**: Form to edit user profile information

### Components:

1. **TourCard.js**: Reusable card component for displaying tour information
2. **UserPoints.js**: Component to display user loyalty points

## Backend Architecture

The backend is built with Node.js and Express.js and follows the Model-View-Controller (MVC) pattern.

### Key Backend Files and Directories:

- **server.js**: Entry point for the application
- **routes/**: API route definitions
- **controllers/**: Request handlers for routes
- **models/**: MongoDB schema definitions
- **config/**: Configuration files, including database connection

### Routes:

1. **tourRoutes.js**: Routes for tour-related operations
2. **userRoutes.js**: Routes for user authentication and profile management
3. **bookingRoutes.js**: Routes for booking operations

### Controllers:

1. **tourController.js**: Handlers for tour routes
2. **userController.js**: Handlers for user routes
3. **bookingController.js**: Handlers for booking routes

### Models:

1. **User.js**: Schema for user data
2. **Booking.js**: Schema for booking data

## Key Features

1. **Tour Browsing**: Users can browse available tours with filtering options
2. **Tour Booking**: Authenticated users can book tours
3. **User Authentication**: Registration, login, and profile management
4. **Booking Management**: Users can view and cancel their bookings
5. **Loyalty Points**: Users earn points for bookings which can be used for discounts
6. **Responsive Design**: Mobile-friendly interface with modern UI elements

## Database Models

### User Model

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
```

### Booking Model

```javascript
const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { 
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true }
  },
  bookingDate: { type: Date, required: true },
  travelers: {
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});
```

## Authentication Flow

1. **Registration**:
   - User submits registration form
   - Server validates input and checks for existing email
   - Password is hashed and stored
   - JWT token is generated and returned

2. **Login**:
   - User submits login credentials
   - Server validates email and password
   - JWT token is generated and returned

3. **Authentication**:
   - JWT token is stored in local storage
   - Token is included in API requests as an Authorization header
   - Server verifies token signature and expiration

## API Endpoints

### User Endpoints

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: User login
- `POST /api/users/verify`: Verify user token
- `POST /api/users/logout/:userId`: User logout
- `GET /api/users/:id`: Get user profile
- `PUT /api/users/:id`: Update user profile
- `GET /api/users/:id/points`: Get user loyalty points

### Tour Endpoints

- `GET /api/tours`: Get all tours
- `GET /api/tours/:id`: Get tour by ID

### Booking Endpoints

- `POST /api/bookings`: Create a new booking
- `GET /api/bookings`: Get all bookings (admin)
- `GET /api/bookings/user/:userId`: Get bookings for a specific user
- `POST /api/bookings/:id/cancel`: Cancel a booking
- `GET /api/bookings/:id`: Get booking by ID

## Component Hierarchy

```
App
├── Navigation
├── Home
├── Tours
│   └── TourCard
├── TourDetails
├── Booking
├── BookingConfirmation
├── BookingDetails
├── Login
├── Register
├── Profile
│   └── UserPoints
└── EditProfile
```

## Styling and UI Design

The application uses a combination of:

1. **Bootstrap 5**: For responsive grid layout and common components
2. **Custom CSS**: For specific styling needs and design customization
3. **Glass-morphism effects**: Semi-transparent cards with blur effects
4. **Gradient backgrounds**: For headers and buttons
5. **Responsive images**: From Unsplash for background images

## Deployment

The application is designed to be deployed as:

1. **Frontend**: Static site on platforms like Netlify, Vercel, or AWS S3
2. **Backend**: Node.js server on platforms like Heroku, AWS EC2, or Azure App Service
3. **Database**: MongoDB Atlas for database hosting

---

This documentation provides a comprehensive overview of the TourBuddy application architecture, components, and functionality. Developers can use this as a reference for understanding the codebase structure, maintaining the application, or adding new features. 