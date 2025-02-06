const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// CRUD Routes
router.post('/create', appointmentController.createAppointment);
router.get('/all', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointment);
router.patch('/update/:id', appointmentController.updateAppointment);
router.delete('/delete/:id', appointmentController.deleteAppointment);

module.exports = router;