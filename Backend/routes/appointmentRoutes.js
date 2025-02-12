const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateConsultantToken, authenticateUserToken, authenticateOrganization, authenticateMultipleRoles } = require('../middleware/authMiddleware');

// CRUD Routes
router.patch('/:appointmentId/status', authenticateMultipleRoles, appointmentController.updateAppointmentStatus);//
router.post('/create', authenticateUserToken, appointmentController.createAppointment);//
router.get('/doctor', authenticateConsultantToken, appointmentController.getDoctorAppointments);//
router.get('/user/:email', authenticateUserToken, appointmentController.getUserAppointments);//
router.get('/all', authenticateOrganization, appointmentController.getAppointmentsByEmail);//
// router.get('/:id', appointmentController.getAppointment);
// router.delete('/delete/:id', appointmentController.deleteAppointment);


// Route for consultant appointments
// router.get('/consultant', appointmentController.getConsultantAppointments);
// Route to update appointment status
// router.patch('/:appointmentId/status', appointmentController.updateAppointmentStatus);//


module.exports = router;