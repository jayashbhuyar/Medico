import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaClinicMedical, FaMapMarkerAlt, FaPhone, FaSearch, 
  FaFilter, FaGlobe, FaCalendar, FaDirections 
} from 'react-icons/fa';

const NavClinic = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    establishedYear: '',
  });
  const [sortBy, setSortBy] = useState('distance');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClinics();
    getUserLocation();
  }, []);

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

  const fetchClinics = async () => {
    try {
        console.log("fetching clinics");
      const response = await axios.get('http://localhost:8000/api/user/clinics/all');
      setClinics(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch clinics');
      setLoading(false);
    }
  };

  const calculateDistance = (clinicLat, clinicLng) => {
    if (!userLocation || !clinicLat || !clinicLng) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(clinicLat - userLocation.lat);
    const dLon = deg2rad(clinicLng - userLocation.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(userLocation.lat)) * Math.cos(deg2rad(clinicLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Best Clinics Near You</h1>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search clinics by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-800 
                       focus:ring-4 focus:ring-green-300 outline-none text-lg pl-12"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ... similar filters panel as NavHospital ... */}
      </div>

      {/* Clinics Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic, index) => (
          <ClinicCard 
            key={clinic._id}
            clinic={clinic}
            distance={calculateDistance(clinic.latitude, clinic.longitude)}
            onViewProfile={() => {
              setSelectedClinic(clinic);
              setShowProfile(true);
            }}
          />
        ))}
      </div>

      {/* Clinic Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedClinic && (
          <ClinicProfile 
            clinic={selectedClinic} 
            onClose={() => {
              setShowProfile(false);
              setSelectedClinic(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ClinicCard = ({ clinic, distance, onViewProfile }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
               transition-all duration-300 border border-gray-100"
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FaClinicMedical className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{clinic.clinicName}</h3>
          <p className="text-sm text-gray-600">Established {clinic.establishedYear}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{clinic.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-gray-400" />
          <span>{clinic.phone}</span>
        </div>
        {distance && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                        font-medium bg-green-100 text-green-800">
            {distance} km away
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={onViewProfile}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg 
                   hover:bg-green-700 transition duration-300"
        >
          View Details
        </button>
        <a
          href={`https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <FaDirections className="w-5 h-5" />
        </a>
      </div>
    </div>
  </motion.div>
);

const ClinicProfile = ({ clinic, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="border-b p-6 flex justify-between items-start bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <FaClinicMedical className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{clinic.clinicName}</h2>
            <p>Established {clinic.establishedYear}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="bg-green-50 rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2 text-green-700">Contact Information</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaPhone className="text-green-600" />
              {clinic.phone}
            </p>
            {clinic.alternatePhone && (
              <p className="flex items-center gap-2">
                <FaPhone className="text-green-600" />
                {clinic.alternatePhone}
              </p>
            )}
            <p className="flex items-center gap-2">
              <FaGlobe className="text-green-600" />
              {clinic.website || 'Not available'}
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="font-semibold mb-2 text-green-700">Location</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" />
              {clinic.address}, {clinic.city}, {clinic.state}, {clinic.pincode}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2 text-green-700">About Clinic</h3>
          <p className="text-gray-600">{clinic.description}</p>
        </div>

        {/* Image */}
        {clinic.image && (
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Clinic Image</h3>
            <img 
              src={clinic.image} 
              alt={clinic.clinicName} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-b-lg">
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50"
          >
            Close
          </button>
          <a
            href={`https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Get Directions
          </a>
        </div>
      </div>
    </motion.div>
  </div>
);

// Add Sorting Controls
const SortingControls = ({ sortBy, setSortBy }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
    <span className="text-gray-600">Sort by:</span>
    <button
      onClick={() => setSortBy('distance')}
      className={`px-4 py-2 rounded-lg ${
        sortBy === 'distance' 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Distance
    </button>
    <button
      onClick={() => setSortBy('name')}
      className={`px-4 py-2 rounded-lg ${
        sortBy === 'name' 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Name
    </button>
    <button
      onClick={() => setSortBy('establishedYear')}
      className={`px-4 py-2 rounded-lg ${
        sortBy === 'establishedYear' 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Established Year
    </button>
  </div>
);

// Add sorting function
const getSortedClinics = (clinics, sortBy, userLocation) => {
  return [...clinics].sort((a, b) => {
    switch(sortBy) {
      case 'distance':
        const distanceA = calculateDistance(a.latitude, a.longitude);
        const distanceB = calculateDistance(b.latitude, b.longitude);
        return distanceA - distanceB;
      case 'name':
        return a.clinicName.localeCompare(b.clinicName);
      case 'establishedYear':
        return b.establishedYear - a.establishedYear;
      default:
        return 0;
    }
  });
};

export default NavClinic;