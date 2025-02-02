const Doctor = require("../models/addDoctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const addClinicDoctor = async (req, res) => {
  try {
    // Validate and sanitize input
    const {
      name,
      email,
      phone,
      degrees,
      experience,
      specialties,
      consultationFees,
      availableDays,
      timeSlots,
      userId,
      password,
      confirmPassword,
      organizationId,
      organizationType,
      organizationName,
      organizationEmail,
      state,
      city,
      address,
      latitude,
      longitude,
    } = req.body;

    // Check for existing doctor
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // Validate password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      degrees,
      experience: parseInt(experience),
      specialties,
      consultationFees: parseInt(consultationFees),
      availableDays,
      timeSlots,
      userId,
      password: hashedPassword,
      organizationId,
      organizationType,
      organizationName,
      organizationEmail,
      state,
      city,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialties: doctor.specialties,
        organizationName: doctor.organizationName,
      },
    });
  } catch (error) {
    console.error("Error adding doctor:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding doctor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getClinicDoctors = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await Doctor.find({
      organizationId: clinicId,
      organizationType: "Clinic",
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
    });
  }
};


// Get all clinics
const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().select('-password');
    res.status(200).json({
      success: true,
      data: clinics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinics',
      error: error.message
    });
  }
};

// Get nearest clinics
const getNearestClinics = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query;

    const clinics = await Clinic.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('-password');

    res.status(200).json({
      success: true,
      data: clinics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearest clinics',
      error: error.message
    });
  }
};

// Get clinic by ID
const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).select('-password');
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }
    res.status(200).json({
      success: true,
      data: clinic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic',
      error: error.message
    });
  }
};

// Register clinic
const registerClinic = async (req, res) => {
  try {
    const { email, password, clinicName } = req.body;

    // Check if clinic already exists
    let clinic = await Clinic.findOne({ email });
    if (clinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new clinic
    clinic = new Clinic({
      ...req.body,
      password: hashedPassword
    });

    await clinic.save();

    // Generate JWT
    const token = jwt.sign(
      { id: clinic._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      data: {
        clinic: {
          id: clinic._id,
          clinicName,
          email
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering clinic',
      error: error.message
    });
  }
};

// Update clinic
const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    res.status(200).json({
      success: true,
      data: clinic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating clinic',
      error: error.message
    });
  }
};

// Delete clinic
const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clinic deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting clinic',
      error: error.message
    });
  }
};

module.exports = {
  addClinicDoctor,
  getClinicDoctors,
  getAllClinics,
  getNearestClinics,
  getClinicById,
  registerClinic,
  updateClinic,
  deleteClinic
  
};
