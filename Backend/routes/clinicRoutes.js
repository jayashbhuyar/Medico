const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/clinicRegcontroller");
const { addClinicDoctor, getClinicDoctors,getAllClinics,getNearestClinics,getClinicById } = require("../controllers/addClinicDoctor");

router.post("/register", register);
router.post("/login", login);
router.post('/add', addClinicDoctor);
router.get('/:clinicId',getClinicDoctors);

// Public routes
router.get('/all', getAllClinics);
router.get('/nearest',getNearestClinics);
router.get('/:id',getClinicById);

module.exports = router;
