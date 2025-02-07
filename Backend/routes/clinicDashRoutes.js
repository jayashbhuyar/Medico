const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinicDashController");
// const { protect } = require('../middleware/authMiddleware');

router.get("/dashboard/:email", clinicController.getClinicDashboard);

module.exports = router;
