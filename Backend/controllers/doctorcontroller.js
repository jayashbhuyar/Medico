const Doctor = require('../models/addDoctor');
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");

const addDoctor = async (req, res) => {
  try {
    const { password, confirmPassword, ...doctorData } = req.body;

    // Parse JSON strings back to objects
    ["degrees", "specialties", "availableDays", "timeSlots"].forEach(
      (field) => {
        if (typeof doctorData[field] === "string") {
          doctorData[field] = JSON.parse(doctorData[field]);
        }
      }
    );

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "organizationId",
      "organizationType",
      "organizationName",
      "organizationEmail",
      "state",
      "city",
      "address",
      "latitude",
      "longitude",
      "degrees",
      "experience",
      "specialties",
      "consultationFees",
      "availableDays",
      "timeSlots",
      "userId",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !doctorData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Handle image upload to Cloudinary
    if (!req.files || !req.files.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.files.profileImage.tempFilePath,
      {
        folder: "doctors",
        width: 300,
        crop: "scale",
      }
    );

    // Validate password
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor with Cloudinary image URL
    const doctor = await Doctor.create({
      ...doctorData,
      password: hashedPassword,
      profileImage: result.secure_url,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        organizationName: doctor.organizationName,
        specialties: doctor.specialties,
        consultationFees: doctor.consultationFees,
        profileImage: doctor.profileImage,
      },
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor",
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