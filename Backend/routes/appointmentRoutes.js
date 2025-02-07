const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// CRUD Routes
router.post('/create', appointmentController.createAppointment);
router.get('/doctor', appointmentController.getDoctorAppointments);
router.get('/all', appointmentController.getAppointmentsByEmail);
router.get('/:id', appointmentController.getAppointment);
router.patch('/update/:id', appointmentController.updateAppointment);
router.delete('/delete/:id', appointmentController.deleteAppointment);


// Route for consultant appointments
router.get('/consultant', appointmentController.getConsultantAppointments);

// Route to update appointment status
router.patch('/:appointmentId/status', appointmentController.updateAppointmentStatus);


module.exports = router;