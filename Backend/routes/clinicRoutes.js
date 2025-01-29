const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/clinicRegcontroller");
const { addClinicDoctor, getClinicDoctors } = require("../controllers/addClinicDoctor");

router.post("/register", register);
router.post("/login", login);
router.post('/add', addClinicDoctor);
router.get('/:clinicId',getClinicDoctors);

module.exports = router;
