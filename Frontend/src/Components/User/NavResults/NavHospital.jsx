import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Search, ArrowDownWideNarrow, 
  Navigation, Info, X, Globe, Mail, Calendar, Star
} from 'lucide-react';
import axios from 'axios';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/hospitals/all');
      const validatedData = response.data.data.map(hospital => ({
        ...hospital,
        name: hospital.hospitalName, // Map hospitalName to name
        coordinates: [hospital.longitude, hospital.latitude] // Create coordinates array
      }));
      setHospitals(validatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchNearestHospitals(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchNearestHospitals = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/hospitals/nearest?latitude=${lat}&longitude=${lng}`
      );
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Error fetching nearest hospitals:', error);
    }
  };

  const calculateDistance = (hospitalLat, hospitalLng) => {
    if (!userLocation || !hospitalLat || !hospitalLng) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(hospitalLat - userLocation.lat);
    const dLon = deg2rad(hospitalLng - userLocation.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(userLocation.lat)) * Math.cos(deg2rad(hospitalLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const fetchHospitalDetails = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/hospitals/${hospitalId}`);
      setSelectedHospital(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching hospital details:', error);
    }
  };

  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div>Error: {error}</div>;

// 

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-lg text-gray-600">Loading hospitals...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Error Loading Data</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchHospitals}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    {/* Hero Section */}
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Find Nearby Hospitals
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Discover and connect with healthcare facilities in your area. Get instant access to hospital information, 
          directions, and contact details.
        </p>
      </div>
    </div>

    {/* Search Section */}
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals by name or location..."
              className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border 
                       border-gray-300 focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={getLocation}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white rounded-xl hover:from-blue-600 hover:to-blue-700 
                       transition-all shadow-sm hover:shadow-md flex items-center 
                       justify-center gap-2 font-medium"
            >
              <MapPin className="w-5 h-5" />
              <span>Near Me</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="distance">Sort by Distance</option>
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    {/* Hospital Cards Grid */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <motion.div
            key={hospital._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow 
                     border border-gray-200 overflow-hidden"
          >
            <div className="relative h-48">
              {hospital.image ? (
                <img
                  src={hospital.image}
                  alt={hospital.hospitalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 
                              flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-blue-500" />
                </div>
              )}
              {calculateDistance(
                hospital.location?.coordinates?.[1] || hospital.coordinates?.[1],
                hospital.location?.coordinates?.[0] || hospital.coordinates?.[0]
              ) && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-blue-500 
                              text-white rounded-full text-sm font-medium">
                  {calculateDistance(
                    hospital.location?.coordinates?.[1] || hospital.coordinates?.[1],
                    hospital.location?.coordinates?.[0] || hospital.coordinates?.[0]
                  )} km
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {hospital.hospitalName}
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{hospital.phone}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fetchHospitalDetails(hospital._id)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg 
                           hover:bg-blue-600 transition-colors flex items-center 
                           justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </button>
                <a
                  href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 
                           rounded-lg hover:bg-gray-50 transition-colors flex 
                           items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Hospital Details Modal */}
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {selectedHospital && (
              <>
                <div className="relative h-64 bg-gradient-to-r from-blue-500 to-blue-600">
                  {selectedHospital.image ? (
                    <img
                      src={selectedHospital.image}
                      alt={selectedHospital.hospitalName}
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-24 h-24 text-white/50" />
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setSelectedHospital(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 
                             rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50">
                    <h2 className="text-3xl font-bold text-white">
                      {selectedHospital.hospitalName}
                    </h2>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span>Established Year</span>
                      </div>
                      <p className="text-lg font-medium">
                        {selectedHospital.establishedYear || 'Not specified'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-5 h-5" />
                        <span>Website</span>
                      </div>
                      <a 
                        href={selectedHospital.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg text-blue-500 hover:underline"
                      >
                        {selectedHospital.website || 'Not available'}
                      </a>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-5 h-5" />
                        <span>Contact</span>
                      </div>
                      <p className="text-lg font-medium">{selectedHospital.phone}</p>
                      {selectedHospital.alternatePhone && (
                        <p className="text-gray-600">
                          Alt: {selectedHospital.alternatePhone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-5 h-5" />
                        <span>Email</span>
                      </div>
                      <p className="text-lg font-medium">{selectedHospital.email}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                      <p>
                        <span className="text-gray-600">Address:</span>{' '}
                        {selectedHospital.address}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p>
                          <span className="text-gray-600">City:</span>{' '}
                          {selectedHospital.city}
                        </p>
                        <p>
                          <span className="text-gray-600">State:</span>{' '}
                          {selectedHospital.state}
                        </p>
                        <p>
                          <span className="text-gray-600">Pincode:</span>{' '}
                          {selectedHospital.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                    {/* About */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        About Hospital
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                      {selectedHospital.description || 
                         'No description available for this hospital.'}
                      </p>
                    </div>

                    {/* Services & Facilities */}
                    {selectedHospital.services && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Services & Facilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedHospital.services.map((service, index) => (
                            <div 
                              key={index}
                              className="bg-blue-50 rounded-lg p-4 flex items-center gap-3"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Star className="w-4 h-4 text-blue-500" />
                              </div>
                              <span className="text-gray-700">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setSelectedHospital(null);
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-xl 
                                 hover:bg-gray-50 transition-colors text-gray-700 
                                 font-medium flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Close
                      </button>
                      <a
                        href={`https://www.google.com/maps?q=${selectedHospital.latitude},${selectedHospital.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                                 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 
                                 transition-all shadow-sm hover:shadow-md font-medium 
                                 flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-5 h-5" />
                        View on Map
                      </a>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hospitals;