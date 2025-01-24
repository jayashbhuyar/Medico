const Clinic = require('../models/clinicReg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

exports.register = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.clinicName || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if clinic exists
    const existingClinic = await Clinic.findOne({ email: req.body.email });
    if (existingClinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic already registered'
      });
    }

    // Handle coordinates
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Process image if exists
    let imageUrl = null;
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'clinics',
        width: 300,
        crop: "scale"
      });
      imageUrl = result.secure_url;
    }

    // Create clinic
    const clinic = new Clinic({
      ...req.body,
      image: imageUrl,
      latitude,
      longitude,
      password: await bcrypt.hash(req.body.password, 12)
    });

    await clinic.save();

    const token = jwt.sign(
      { clinicId: clinic._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Clinic registered successfully',
      token,
      clinic: {
        id: clinic._id,
        name: clinic.clinicName,
        email: clinic.email,
        image: imageUrl
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
  
      // Find clinic
      const clinic = await Clinic.findOne({ email });
      if (!clinic) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, clinic.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Generate token
      const token = jwt.sign(
        { clinicId: clinic._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      // Success response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        clinic: {
          id: clinic._id,
          name: clinic.clinicName,
          email: clinic.email
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  };
  
  // exports.login = async (req, res) => {

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Clinic = require('../models/Clinic'); // Adjust the path as needed

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Debug: Log incoming email and password
//     console.log('Incoming email:', email);
//     console.log('Incoming password:', password);

//     // Validate input
//     if (!email || !password) {
//       console.log('Missing email or password');
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required',
//       });
//     }

//     // Find clinic
//     const clinic = await Clinic.findOne({ email });
//     if (!clinic) {
//       console.log('Clinic not found for email:', email);
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials',
//       });
//     }

//     // Debug: Log hashed password from the database
//     console.log('Hashed password from DB:', clinic.password);

//     // Compare password
//     const isMatch = await bcrypt.compare(password, clinic.password);
//     const plainPassword = password;
// const hashedPassword = clinic.password;

// bcrypt.compare(plainPassword, hashedPassword)
//   .then((isMatch) => {
//     console.log('Password match:', isMatch);
//   })
//   .catch((err) => {
//     console.error('Error comparing passwords:', err);
//   });

//     // Debug: Log comparison result
//     console.log('Password match result:', isMatch);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials',
//       });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { clinicId: clinic._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Success response
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       clinic: {
//         id: clinic._id,
//         name: clinic.clinicName,
//         email: clinic.email,
//       },
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Login failed',
//     });
//   }
// };



// const bcrypt = require('bcryptjs');

//
//   try {
//     const { email, password } = req.body;

//     const clinic = await Clinic.findOne({ email });
//     if (!clinic) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const isMatch = await bcrypt.compare(password, clinic.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const token = jwt.sign(
//       { clinicId: clinic._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       success: true,
//       token,
//       clinic: {
//         id: clinic._id,
//         name: clinic.clinicName,
//         email: clinic.email,
//         image: clinic.image
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Login failed'
//     });
//   }
// };