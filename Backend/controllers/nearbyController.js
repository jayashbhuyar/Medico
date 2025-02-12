const Doctor = require('../models/addDoctor');
const Hospital = require('../models/hospitalReg');
const Clinic = require('../models/clinicReg');

const nearbyController = {
  // Find nearby doctors
  findNearbyDoctors: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }

      const doctors = await Doctor.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      }).limit(20);

      res.json({
        success: true,
        results: doctors,
        count: doctors.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Find nearby hospitals
  findNearbyHospitals: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }

      const hospitals = await Hospital.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius * 1000
          }
        }
      }).limit(20);

      res.json({
        success: true,
        results: hospitals,
        count: hospitals.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Find nearby clinics
  findNearbyClinics: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }

      const clinics = await Clinic.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius * 1000
          }
        }
      }).limit(20);

      res.json({
        success: true,
        results: clinics,
        count: clinics.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
,
  getNearbyHospitals: async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      
      // Make request to your hospital data API
      const response = await axios.get('your_api_endpoint', {
        params: {
          lat: latitude,
          lon: longitude,
        }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch hospitals',
        details: error.message 
      });
    }
  }
};

module.exports = nearbyController;