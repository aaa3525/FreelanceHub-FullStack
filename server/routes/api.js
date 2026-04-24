const express = require('express');
const router = express.Router();
const freelanceController = require('../controllers/freelanceController');

// Get all services
router.get('/services', freelanceController.getAllServices);

// Get single service
router.get('/services/:id', freelanceController.getServiceById);

// Add new service (bonus)
router.post('/services', freelanceController.addService);

// Save service
router.post('/save', freelanceController.saveService);

// Hire service
router.post('/hire', freelanceController.hireService);

// Get saved services
router.get('/saved', freelanceController.getSavedServices);

// Get hired services
router.get('/hired', freelanceController.getHiredServices);

module.exports = router;