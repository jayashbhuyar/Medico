const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const Consultant = require("../models/consultantReg");
const Doctor = require("../models/addDoctor");



exports.register = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.doctorName || !req.body.email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if hospital exists
        const existingConsultant = await Consultant.findOne({ email: req.body.email });
        if (existingConsultant) {
            return res.status(400).json({
                success: false,
                message: 'Consultant already registered'
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
                folder: 'hospitals',
                width: 300,
                crop: "scale"
            });
            imageUrl = result.secure_url;
        }

        // Create hospital
        const consultant = new Consultant({
            ...req.body,
            image: imageUrl,
            latitude,
            longitude,
            password: await bcrypt.hash(req.body.password, 12)
        });

        await consultant.save();

        const token = jwt.sign(
            { consultantId: consultant._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Consultant registered successfully',
            token,
            consultant: {
                id: consultant._id,
                name: consultant.doctorName,
                email: consultant.email,
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
        const { email, userId, password } = req.body;
        let user;
        let isConsultant = true; // Flag to track user type

        // Check if login is via email or userId
        if (email) {
            user = await Consultant.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email not registered!'
                });
            }
        } else if (userId) {
            user = await Consultant.findOne({ userId });
            if (!user) {
                user = await Doctor.findOne({ userId });
                isConsultant = false;
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID not found!'
                    });
                }
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or user ID'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                role: isConsultant ? 'Consultant' : 'Doctor'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        // Prepare response based on user type
        let userResponse;
        
        if (isConsultant) {
            // Consultant response structure
            userResponse = {
                id: user._id,
                doctorName: user.doctorName,
                email: user.email,
                phone: user.phone,
                state: user.state,
                city: user.city,
                address: user.address,
                specialization: user.specialization,
                experience: user.experience,
                userId: user.userId,
                role: 'Consultant'
            };
        } else {
            // Doctor response structure
            userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                organizationEmail: user.organizationEmail,
                organizationName: user.organizationName,
                organizationType: user.organizationType,
                state: user.state,
                city: user.city,
                address: user.address,
                degrees: user.degrees,
                specialties: user.specialties,
                experience: user.experience,
                consultationFees: user.consultationFees,
                availableDays: user.availableDays,
                timeSlots: user.timeSlots,
                userId: user.userId,
                role: 'Doctor'
            };
        }

        res.status(200).json({
            success: true,
            token,
            data: { user: userResponse }
        });
        // console.log('Login successful:', user);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


