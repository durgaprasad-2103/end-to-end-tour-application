const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify', userController.getCurrentUser);
router.post('/logout/:userId', userController.logout);

// User profile routes
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);
router.get('/:id/points', userController.getUserPoints);

// Development routes
router.get('/', userController.getAllUsers);

module.exports = router; 