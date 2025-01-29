const Doctor = require('../models/addDoctor');
const bcrypt = require('bcryptjs');

// const addDoctor = async (req, res) => {
//   try {
//     const { password, confirmPassword, ...doctorData } = req.body;

//     // Validate password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords don't match"
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create doctor with hashed password
//     const doctor = await Doctor.create({
//       ...doctorData,
//       password: hashedPassword
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Doctor added successfully',
//       doctor: {
//         id: doctor._id,
//         name: doctor.name,
//         email: doctor.email,
//         userId: doctor.userId
//       }
//     });

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

const addDoctor = async (req, res) => {
  try {
    const { password, confirmPassword, ...doctorData } = req.body;

    // Validate required fields
    const requiredFields = [
      'name', 'email', 'phone', 'organizationId', 'organizationType',
      'organizationName', 'organizationEmail', 'state', 'city', 'address',
      'latitude', 'longitude', 'degrees', 'experience', 'specialties',
      'consultationFees', 'availableDays', 'timeSlots', 'userId'
    ];

    const missingFields = requiredFields.filter(field => !doctorData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate password
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor
    const doctor = await Doctor.create({
      ...doctorData,
      password: hashedPassword
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        organizationName: doctor.organizationName,
        specialties: doctor.specialties,
        consultationFees: doctor.consultationFees
      }
    });

  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add doctor'
    });
  }
};


const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ organizationId: req.params.organizationId });
    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addDoctor,
  getAllDoctors
};