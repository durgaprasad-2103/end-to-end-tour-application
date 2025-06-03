const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// GET all tours
router.get('/', tourController.getAllTours);

// GET tour by ID
router.get('/:id', tourController.getTourById);

module.exports = router; 