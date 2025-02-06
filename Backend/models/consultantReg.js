const mongoose = require('mongoose')


const consultantSchema = new mongoose.Schema({
    doctorName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    address: { type: String, required: true },
    experience: { type: Number },
    specialities: { type: String },
    consultationFees: { type: Number },
    description: { type: String },
    photo: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    password: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    password: { type: String, required: true },

})

module.exports = mongoose.model("Consultant", consultantSchema)