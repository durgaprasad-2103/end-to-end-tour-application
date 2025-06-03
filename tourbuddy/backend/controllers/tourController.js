// Sample tour data
const tours = [
  {
    id: 1,
    title: "Paris City Tour",
    location: "Paris, France",
    price: 299,
    duration: 3
  },
  {
    id: 2,
    title: "Tokyo Explorer",
    location: "Tokyo, Japan",
    price: 499,
    duration: 5
  },
  {
    id: 3,
    title: "New York Adventure",
    location: "New York, USA",
    price: 399,
    duration: 4
  },
  {
    id: 4,
    title: "Safari Experience",
    location: "Nairobi, Kenya",
    price: 599,
    duration: 7
  },
  {
    id: 5,
    title: "Venice Gondola Tour",
    location: "Venice, Italy",
    price: 199,
    duration: 2
  },
  {
    id: 6,
    title: "Inca Trail Trek",
    location: "Cusco, Peru",
    price: 799,
    duration: 6
  },
  {
    id: 7,
    title: "Great Barrier Reef Dive",
    location: "Cairns, Australia",
    price: 449,
    duration: 3
  },
  {
    id: 8,
    title: "Northern Lights Expedition",
    location: "Tromsø, Norway",
    price: 899,
    duration: 5
  },
  {
    id: 9,
    title: "Santorini Island Escape",
    location: "Santorini, Greece",
    price: 649,
    duration: 4
  },
  {
    id: 10,
    title: "Bangkok Temple Tour",
    location: "Bangkok, Thailand",
    price: 249,
    duration: 2
  }
];

// Export tours for other modules to use
exports.tours = tours;

// Get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

// Get tour by ID
exports.getTourById = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(tour => tour.id === id);
  
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}; 