const express = require('express');
const router = express.Router();
const freelanceControllers = require('../controllers/freelanceControllers');

// Get all services
router.get('/services', freelanceControllers.getAllServices);

// Get single service
router.get('/services/:id', freelanceControllers.getServiceById);

// Add new service (bonus)
router.post('/services', freelanceControllers.addService);

// Save service
router.post('/save', freelanceControllers.saveService);

// Hire service
router.post('/hire', freelanceControllers.hireService);

// Get saved services
router.get('/saved', freelanceControllers.getSavedServices);

// Get hired services
router.get('/hired', freelanceControllers.getHiredServices);

module.exports = router;