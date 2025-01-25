const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema(
  {
    // Organization Reference
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "organizationType",
    },
    organizationType: {
      type: String,
      required: true,
      enum: ["Hospital", "Clinic"],
    },
    organizationName: {
      type: String,
      required: true,
    },
    organizationEmail: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    // Doctor Personal Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      trim: true,
      lowercase: true,
    },
    degrees: [
      {
        type: String,
        enum: [
          "MBBS",
          "MD",
          "MS",
          "DNB",
          "DM",
          "MCh",
          "BDS",
          "MDS",
          "BHMS",
          "BAMS",
          "BUMS",
          "DHMS",
          "PhD",
        ],
      },
    ],
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    specialties: [
      {
        type: String,
        enum: [
          "Cardiology",
          "Neurology",
          "Orthopedics",
          "Pediatrics",
          "Gynecology",
          "Dermatology",
          "ENT",
          "Ophthalmology",
          "Psychiatry",
          "Dental",
          "General Medicine",
        ],
      },
    ],
    consultationFees: {
      type: Number,
      required: true,
      min: 0,
    },

    // Availability
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    timeSlots: {
      start: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"],
      },
      end: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, "End time must be in HH:mm format"],
      },
    },

    // Login Credentials
    userId: {
      type: String,
      required: true,
      unique: true,
      // match: [/^[a-zA-Z0-9]+$/, 'User ID must be alphanumeric'],
      minlength: [4, "User ID must be at least 4 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
doctorSchema.pre('save', async function (next) {
  const user = this;

  // Check if the userId already exists in the database
  const existingUser = await mongoose.models.Doctor.findOne({ userId: user.userId });

  
  if (existingUser) {
    // If userId already exists, throw an error
    const error = new Error('User ID already exists');
    return next(error);
  }

  // If userId is unique, proceed with the save
  next();
});

// Hash password before saving
// doctorSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("Doctor", doctorSchema);
