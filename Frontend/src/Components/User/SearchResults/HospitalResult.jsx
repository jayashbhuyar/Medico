import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDirections, FaInfo } from 'react-icons/fa';
import { Building2, Phone, MapPin, Navigation, Info, X, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const HospitalResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchHospitalDetails = async (hospitalId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/user/hospitals/${hospitalId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hospital details');
      }
      const data = await response.json();
      setSelectedHospital(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch hospital details');
    } finally {
      setLoading(false);
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

  const renderHospitalCard = (hospital) => {
    const distance = calculateDistance(hospital.latitude, hospital.longitude);
    
    return (
      <motion.div
        key={hospital._id}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 
                   border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* Hospital Image/Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
            {hospital.image ? (
              <img
                src={hospital.image}
                alt={hospital.hospitalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 
                           flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            )}
            {distance && (
              <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-blue-600 text-white 
                             text-sm font-semibold rounded-full shadow-lg">
                {distance} km
              </span>
            )}
          </div>
        </div>

        {/* Hospital Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{hospital.hospitalName}</h3>
          <div className="space-y-2 text-gray-600">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              {hospital.phone || "N/A"}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {hospital.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 justify-center md:justify-start">
            <button
              onClick={() => fetchHospitalDetails(hospital._id)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white 
                         rounded-full hover:bg-blue-700 transition-all shadow-md"
            >
              <Info className="w-4 h-4" />
              View Details
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border-2 border-gray-300 
                       text-gray-700 rounded-full hover:bg-gray-50 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

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
          {sortedHospitals.map((hospital) => renderHospitalCard(hospital))}
        </div>
      </div>
      {showModal && <HospitalDetailModal />}
    </div>
  );
};

const HospitalDetailModal = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : selectedHospital ? (
        <>
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full 
                       hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-24 h-24 text-white/50" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedHospital.hospitalName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    {selectedHospital.phone}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    {selectedHospital.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-5 h-5" />
                    {selectedHospital.website || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                <p className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  {selectedHospital.address}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 
                           text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          No hospital details available
        </div>
      )}
    </motion.div>
  </motion.div>
);

export default HospitalResults;