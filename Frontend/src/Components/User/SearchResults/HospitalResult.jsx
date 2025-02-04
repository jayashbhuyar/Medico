import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDirections, FaInfo } from 'react-icons/fa';
import { Building2, Phone, MapPin, Navigation, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const HospitalResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');

  const calculateDistance = (hospitalLat, hospitalLng) => {
    if (!userLocation || !hospitalLat || !hospitalLng) return null;
    const R = 6371;
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(hospitalLat);
    const lon2 = parseFloat(hospitalLng);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
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
        () => toast.error('Please enable location services')
      );
    }
  };

  const sortedHospitals = [...results].sort((a, b) => {
    if (sortBy === 'distance' && userLocation) {
      const distanceA = calculateDistance(a.latitude, a.longitude);
      const distanceB = calculateDistance(b.latitude, b.longitude);
      return distanceA - distanceB;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hospitals matching "{searchTerm}"
          </h1>
          <p className="text-gray-600">Found {results.length} results</p>
        </div>

        {/* Near Me Button */}
        <div className="mb-6">
          <button
            onClick={handleNearMe}
            className="px-6 py-2 bg-blue-600 text-white rounded-full 
                     hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <FaMapMarkerAlt />
            Find Near Me
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-6">
          {sortedHospitals.map((hospital) => (
            <HospitalCard 
              key={hospital._id} 
              hospital={hospital}
              distance={calculateDistance(hospital.latitude, hospital.longitude)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HospitalCard = ({ hospital, distance }) => (
  <motion.div
    whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
    className="bg-white rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 
               border border-gray-200 shadow-sm transition-all duration-300"
  >
    {/* Hospital Image */}
    <div className="relative flex-shrink-0">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 shadow">
        {hospital.image ? (
          <img
            src={hospital.image}
            alt={hospital.hospitalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>
      {distance && (
        <span className="absolute -bottom-2 -right-2 px-2 py-1 bg-blue-500 text-white 
                        text-xs font-medium rounded-full shadow-md">
          {distance} km
        </span>
      )}
    </div>

    {/* Hospital Info */}
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-lg font-semibold text-gray-800">{hospital.hospitalName}</h3>
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p className="flex items-center justify-center md:justify-start">
          <Phone className="w-4 h-4 mr-2 text-blue-500" />
          {hospital.phone || "N/A"}
        </p>
        <p className="flex items-center justify-center md:justify-start">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          {hospital.address}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3 justify-center md:justify-start">
        <button
          onClick={() => fetchHospitalDetails(hospital._id)}
          className="flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white text-sm font-medium 
                     rounded-full hover:bg-blue-600 transition-all"
        >
          <Info className="w-4 h-4" />
          Details
        </button>
        <a
          href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium 
                     rounded-full hover:bg-gray-100 transition-all"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </a>
      </div>
    </div>
  </motion.div>
);

export default HospitalResults;