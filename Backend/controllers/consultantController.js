const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const Consultant = require("../models/consultantReg");


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
        const { email, password } = req.body;

        const user = await Consultant.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Email not exists!'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}