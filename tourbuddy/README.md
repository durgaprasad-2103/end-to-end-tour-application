# TourBuddy

A full-stack JavaScript application for browsing and booking tours.

## Project Structure

```
tourbuddy/
├── backend/             # Node.js + Express server
│   ├── routes/          # Route definitions
│   ├── controllers/     # Controller logic
│   ├── server.js        # Main server file
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/             # Source code
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── App.js       # Main App component
│       └── index.js     # Entry point
├── package.json         # Monorepo root package.json
```

## Features

- Backend API with Express
- Frontend UI with React
- Tour listing and detailed view
- Tour booking with form validation
- Booking confirmation page
- Image gallery and visual enhancements
- Filtering and search capabilities
- Smooth animations and transitions
- Responsive design with Bootstrap

## Application Flow

1. Browse available tours on the Tours page
2. Click on a tour to view detailed information
3. Click "Book Now" to proceed to the booking form
4. Fill out the booking form with personal information and select from available dates
5. Submit the form to receive a booking confirmation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd tourbuddy
npm run install:all
```

### Running the Application

#### Option 1: Run backend and frontend separately (recommended for development)

Start the backend server:

```bash
cd tourbuddy/backend
npm start
```

The backend will run on port 8000: http://localhost:8000

In a new terminal window, start the frontend:

```bash
cd tourbuddy/frontend
PORT=3001 npm start
```

The frontend will run on port 3001: http://localhost:3001

#### Option 2: Use concurrently (if you have it installed)

```bash
cd tourbuddy
npm run dev
```

### API Endpoints

- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get a specific tour by ID

## Troubleshooting

If you encounter port conflicts, you can:
1. Change the backend port in `backend/server.js` (default: 8000)
2. Change the frontend port by using `PORT=xxxx npm start` (default: 3001)
3. Update the proxy in `frontend/package.json` to match your backend port 