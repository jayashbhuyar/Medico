const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // console.log(token);  // Debugging
   console.log('Headers:', req.headers); // Debugging: Log all headers

    // Extract token from Authorization header
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req.header('authorization')?.replace('Bearer ', '');

    console.log('Token:', token); // Debugging: Log the extracted token



    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.hospitalId).select('-password');
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    req.hospital = hospital;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

module.exports = { authMiddleware };
