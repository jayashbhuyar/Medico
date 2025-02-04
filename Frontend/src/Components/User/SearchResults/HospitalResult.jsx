import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaHospital, FaMapMarkerAlt, FaDirections, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import HospitalProfile from '../NavResults/HospitalProfile';

const HospitalResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [sortBy, setSortBy] = useState('rating');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Distance calculation function
  const calculateDistance = (hospitalLat, hospitalLng) => {
    if (!userLocation || !hospitalLat || !hospitalLng) return null;
    
    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(hospitalLat);
    const lon2 = parseFloat(hospitalLng);
    
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSortBy('distance');
          toast.success('Location updated successfully');
        },
        (error) => {
          toast.error('Please enable location services');
        }
      );
    }
  };

  const sortedHospitals = [...results].sort((a, b) => {
    switch(sortBy) {
      case 'rating': 
        return (b.rating || 0) - (a.rating || 0);
      case 'distance':
        if (!userLocation) return 0;
        const distanceA = calculateDistance(a.latitude, a.longitude);
        const distanceB = calculateDistance(b.latitude, b.longitude);
        return distanceA - distanceB;
      default: 
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Search Results for "{searchTerm}"
          </motion.h1>
          <p className="text-blue-100 text-lg">
            Found {results.length} hospitals matching your search
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaFilter />
              <span>Sort by:</span>
            </div>
            
            <motion.select
              whileTap={{ scale: 0.95 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-blue-200 focus:border-blue-500 
                       outline-none transition-all hover:border-blue-300"
            >
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNearMe}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-full 
                       hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md"
            >
              <FaMapMarkerAlt />
              <span>Near Me</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedHospitals.map((hospital, index) => (
              <motion.div 
                key={hospital._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaHospital className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{hospital.name}</h3>
                      <p className="text-sm text-gray-500">{hospital.city}, {hospital.state}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 mb-4">{hospital.address}</div>
                  {userLocation && (
                    <div className="text-sm text-blue-600 mb-4">
                      {calculateDistance(hospital.latitude, hospital.longitude)} km away
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedHospital(hospital);
                        setShowProfile(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FaEye className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900 flex items-center gap-1"
                    >
                      <FaDirections className="w-4 h-4" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Hospital Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedHospital && (
          <HospitalProfile
            hospital={selectedHospital}
            distance={calculateDistance(selectedHospital.latitude, selectedHospital.longitude)}
            onClose={() => {
              setShowProfile(false);
              setSelectedHospital(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalResults;