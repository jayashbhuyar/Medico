const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config();

// Import Routes
const hospitalRoutes = require('./routes/hospitalRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const doctorRoutes = require("./routes/doctorRoutes");
// const clinicRoutes = require('./routes/clinicRoutes');
// const consultantRoutes = require('./routes/consultantRoutes');
const searchRoutes = require('./routes/patientSearch');
const usernavRoutes=require('./routes/usernavRoutes')
const nearbyRoutes = require('./routes/nearbyRoutes');

const{validateToken,authenticateToken}=require('./middleware/authMiddleware');

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow only your frontend origin
  credentials: true,  // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
  app.use("/api/hospitals", hospitalRoutes);
  app.use('/api/clinics', clinicRoutes);
  app.use('/api/token/validate',validateToken)
  app.use('/api/search', nearbyRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/doctors",authenticateToken, doctorRoutes);
// Routes
app.use('/api/user/v2', usernavRoutes);
app.use("/api/user/hospitals", usernavRoutes);
// Add to existing routes
// app.use('/api/hospitals', hospitalRoutes);
// app.use('/api/clinics', clinicRoutes);
// app.use('/api/consultants', consultantRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Nirogya API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Port configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});