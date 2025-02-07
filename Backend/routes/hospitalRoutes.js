const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/hospitalRegcontroller");
const {validateToken} = require("../middleware/authMiddleware");

// Public routes
// router.get("/validate",authMiddleware);
router.post("/register", register);
router.post("/login", login);
router.get('hospital/:email')

// Protected routes - require authentication
// router.get('/profile', authMiddleware, getProfile);
// router.put('/profile/update', authMiddleware, updateProfile);
// router.delete('/profile/delete', authMiddleware, deleteProfile);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Hospital route is working" });
});

module.exports = router;
