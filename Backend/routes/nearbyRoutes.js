const express = require('express');
const router = express.Router();
const nearbyController = require('../controllers/nearbyController');

// Nearby search routes
router.post('/doctors/nearby', nearbyController.findNearbyDoctors);
router.post('/hospitals/nearby', nearbyController.findNearbyHospitals);
router.post('/clinics/nearby', nearbyController.findNearbyClinics);

module.exports = router;