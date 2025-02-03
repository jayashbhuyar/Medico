const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitalReg');

exports.validateToken = async (req, res) => {
  try {
    const token = req.cookies.hospitalToken;
    // console.log("🔐 Token from cookies:", token);
    if (!token) {

      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.hospitalId);

    if (!hospital) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.json({ success: true, message: "Token is valid" });
  } catch (error) {
    console.error("Error validating token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.hospitalToken || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;  // Store decoded info (e.g., user ID) in request for future use
    next();  // Proceed to next middleware or route handler
  });
};
