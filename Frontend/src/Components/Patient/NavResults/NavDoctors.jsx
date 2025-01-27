import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaUserMd, FaMapMarkerAlt, FaHospital, FaClinicMedical, 
         FaClock, FaStar, FaRupeeSign, FaFilter, FaSearch, FaSliders } from 'react-icons/fa';

import DoctorProfile from './DoctorProfile';

const NavDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    specialty: '',
    maxFee: '',
    organization: ''
  });
  const [sortBy, setSortBy] = useState('distance');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
    getUserLocation();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/v2/doctors/all');
      setDoctors(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const calculateDistance = (doctorLat, doctorLng) => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(doctorLat - userLocation.lat);
    const dLon = deg2rad(doctorLng - userLocation.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(userLocation.lat)) * Math.cos(deg2rad(doctorLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI/180);

  const sortedDoctors = [...doctors].sort((a, b) => {
    switch(sortBy) {
      case 'distance':
        return calculateDistance(a.latitude, a.longitude) - calculateDistance(b.latitude, b.longitude);
      case 'fees':
        return a.consultationFees - b.consultationFees;
      case 'experience':
        return b.experience - a.experience;
      default:
        return 0;
    }
  });

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfile(true);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-600 text-white py-16 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Right Doctor</h1>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search doctors by name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-800 
                       focus:ring-4 focus:ring-blue-300 outline-none text-lg pl-12"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters & Sort Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md
                       hover:shadow-lg transition-all duration-300"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-md 
                       hover:shadow-lg transition-all duration-300"
            >
              <option value="distance">Sort by Distance</option>
              <option value="fees">Sort by Fees</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
          <button
            onClick={getUserLocation}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-all duration-300 w-full md:w-auto"
          >
            <FaMapMarkerAlt />
            <span>Near Me</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Specialties</option>
                    {/* Add specialty options */}
                  </select>
                </div>
                {/* Add more filters */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-6">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard 
                  doctor={doctor}
                  distance={calculateDistance(doctor.latitude, doctor.longitude)}
                  onViewProfile={() => {
                    setSelectedDoctor(doctor);
                    setShowProfile(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedDoctor && (
          <DoctorProfile 
            doctor={selectedDoctor} 
            onClose={() => {
              setShowProfile(false);
              setSelectedDoctor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Update DoctorCard component with enhanced styling
const DoctorCard = ({ doctor, distance, onViewProfile }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                 transition-all duration-300 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUserMd className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {doctor.degrees.join(", ")}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {doctor.organizationType === "Hospital" ? (
              <FaHospital className="text-blue-600" />
            ) : (
              <FaClinicMedical className="text-green-600" />
            )}
            <span>{doctor.organizationName}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>{doctor.city}, {doctor.state}</span>
            {distance && (
              <span className="text-blue-600 font-medium">({distance} km)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-gray-400" />
            <span>₹{doctor.consultationFees} Consultation Fee</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-gray-400" />
            <span>{doctor.timeSlots.start} - {doctor.timeSlots.end}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg 
                           hover:bg-blue-700 transition duration-300 shadow-md">
            Book Appointment
          </button>
          <button 
            onClick={onViewProfile}
            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 
                     rounded-lg hover:bg-blue-50 transition duration-300"
          >
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NavDoctors;