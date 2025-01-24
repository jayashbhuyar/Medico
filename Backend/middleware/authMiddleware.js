const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitalReg');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get hospital from database
    const hospital = await Hospital.findById(decoded.hospitalId).select('-password');
    
    if (!hospital) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hospital not found' 
      });
    }

    // Attach hospital to request object
    req.hospital = hospital;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token is invalid or expired' 
    });
  }
};

module.exports = authMiddleware;