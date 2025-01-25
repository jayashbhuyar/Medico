const express = require('express');
const router = express.Router();
const { addDoctor, getAllDoctors } = require('../controllers/doctorcontroller');
// const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/add', addDoctor);
// router.get('/organization/:organizationId', protect, getAllDoctors);

module.exports = router;