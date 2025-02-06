const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Basic CRUD routes
router.post('/create', reviewController.createReview);
router.get('/all', reviewController.getReviews);
router.get('/hospital/:email', reviewController.getHospitalReviews);
router.get('/clinic/:email', reviewController.getClinicReviews);
router.patch('/update/:id', reviewController.updateReview);
router.delete('/delete/:id', reviewController.deleteReview);

module.exports = router;