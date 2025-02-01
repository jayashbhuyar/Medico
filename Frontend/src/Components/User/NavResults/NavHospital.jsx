import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHospital, FaMapMarkerAlt, FaPhone, FaSearch, 
  FaSortAmountDown, FaDirections, FaInfoCircle 
} from 'react-icons/fa';
import axios from 'axios';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Search Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search hospitals..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-md border 
                         border-zinc-300 focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-zinc-400" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={getLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md 
                         hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaMapMarkerAlt />
                Near Me
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-zinc-300 rounded-md 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="distance">Sort by Distance</option>
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {hospitals.map((hospital) => (
                  <motion.tr
                    key={hospital._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                          {hospital.image ? (
                            <img
                              src={hospital.image}
                              alt={hospital.hospitalName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaHospital className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">{hospital.hospitalName}</div>
                          <div className="text-sm text-zinc-500">{hospital.type || 'General Hospital'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="mt-1 text-zinc-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-600">{hospital.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-zinc-400" />
                        <span className="text-sm text-zinc-600">{hospital.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {calculateDistance(
                        hospital.location?.coordinates?.[1] || hospital.coordinates?.[1],
                        hospital.location?.coordinates?.[0] || hospital.coordinates?.[0]
                      ) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {calculateDistance(
                            hospital.location?.coordinates?.[1] || hospital.coordinates?.[1],
                            hospital.location?.coordinates?.[0] || hospital.coordinates?.[0]
                          )} km
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => fetchHospitalDetails(hospital._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent 
                                   text-xs font-medium rounded-md text-white bg-blue-600 
                                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                                   focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaInfoCircle className="mr-1" />
                          Details
                        </button>
                        <a
                          href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-zinc-300 
                                   text-xs font-medium rounded-md text-zinc-700 bg-white 
                                   hover:bg-zinc-50 focus:outline-none focus:ring-2 
                                   focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaDirections className="mr-1" />
                          Directions
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <HospitalDetailsModal 
          hospital={selectedHospital} 
          onClose={() => {
            setShowModal(false);
            setSelectedHospital(null);
          }} 
        />
      )}
    </div>
  );
};

const HospitalDetailsModal = ({ hospital, onClose }) => {
  if (!hospital) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{hospital.hospitalName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Established Year</p>
                <p className="font-medium">{hospital.establishedYear || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <a href={hospital.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">{hospital.website || 'Not available'}</a>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Primary Phone</p>
                <p className="font-medium">{hospital.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alternative Phone</p>
                <p className="font-medium">{hospital.alternatePhone || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{hospital.email}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Location</h3>
            <div className="space-y-2">
              <p><span className="text-gray-600">Address:</span> {hospital.address}</p>
              <p><span className="text-gray-600">City:</span> {hospital.city}</p>
              <p><span className="text-gray-600">State:</span> {hospital.state}</p>
              <p><span className="text-gray-600">Pincode:</span> {hospital.pincode}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">About Hospital</h3>
            <p className="text-gray-700">{hospital.description}</p>
          </div>

          {/* Image */}
          {hospital.image && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Hospital Image</h3>
              <img 
                src={hospital.image} 
                alt={hospital.hospitalName} 
                className="w-full max-w-2xl rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <a
            href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View on Map
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Hospitals;