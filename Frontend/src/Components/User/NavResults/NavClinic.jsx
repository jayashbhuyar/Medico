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

  const fetchClinics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clinics/all');
      setClinics(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch clinics');
      setLoading(false);
    }
  };

  // ... similar location and distance calculation functions as NavHospital ...

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

// const ClinicProfile = ({ clinic, onClose }) => (
//   // ... Clinic Profile Modal Component ...
// );

export default NavClinic;