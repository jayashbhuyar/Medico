const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitalReg');
const User = require('../models/user'); // Ensure the correct path to the User model
const Clinic = require('../models/clinicReg');
const Consultant = require('../models/consultantReg');

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

exports.authenticateUserToken = async (req, res, next) => {
  const token = req.cookies.userToken || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;  // Attach user info to request
    next();  // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Error validating token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateHospitalToken = async (req, res, next) => {
  const token = req.cookies.hospitalToken || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.hospitalId);

    if (!hospital) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    console.error("Error validating token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateClinicToken = async (req, res, next) => {
  const token = req.cookies.clinicToken || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clinic = await Clinic.findById(decoded.clinicId);

    if (!clinic) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.clinic = clinic;
    next();
  } catch (error) {
    console.error("Error validating clinic token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateConsultantToken = async (req, res, next) => {
  const token = req.cookies.consultantToken || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const consultant = await Consultant.findById(decoded.consultantId);

    if (!consultant) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.consultant = consultant;
    next();
  } catch (error) {
    console.error("Error validating consultant token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
exports.authenticateOrganization = async (req, res, next) => {
  const hospitalToken = req.cookies.hospitalToken;
  const clinicToken = req.cookies.clinicToken;
  
  if (!hospitalToken && !clinicToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    if (hospitalToken) {
      const decoded = jwt.verify(hospitalToken, process.env.JWT_SECRET);
      const hospital = await Hospital.findById(decoded.hospitalId);
      if (hospital) {
        req.organization = hospital;
        req.organizationType = 'hospital';
        return next();
      }
    }
    
    if (clinicToken) {
      const decoded = jwt.verify(clinicToken, process.env.JWT_SECRET);
      const clinic = await Clinic.findById(decoded.clinicId);
      if (clinic) {
        req.organization = clinic;
        req.organizationType = 'clinic';
        return next();
      }
    }
    
    return res.status(401).json({ success: false, message: "Invalid token" });
    
  } catch (error) {
    console.error("Error validating token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
exports.authenticateMultipleRoles = async (req, res, next) => {
  const clinicToken = req.cookies.clinicToken;
  const consultantToken = req.cookies.consultantToken;
  const userToken = req.cookies.userToken;
  
  if (!clinicToken && !consultantToken && !userToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    if (clinicToken) {
      const decoded = jwt.verify(clinicToken, process.env.JWT_SECRET);
      const clinic = await Clinic.findById(decoded.clinicId);
      if (clinic) {
        req.user = clinic;
        req.userType = 'clinic';
        return next();
      }
    }
    
    if (consultantToken) {
      const decoded = jwt.verify(consultantToken, process.env.JWT_SECRET);
      const consultant = await Consultant.findById(decoded.consultantId);
      if (consultant) {
        req.user = consultant;
        req.userType = 'consultant';
        return next();
      }
    }
    
    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        req.userType = 'user';
        return next();
      }
    }
    
    return res.status(401).json({ success: false, message: "Invalid token" });
    
  } catch (error) {
    console.error("Error validating token", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};