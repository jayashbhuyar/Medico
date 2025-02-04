import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserMd, FaStar, FaMoneyBillWave, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEye, FaDirections } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DoctorProfile from '../NavResults/DoctorProfile';

const SpecialtyResults = () => {
  const { state } = useLocation();
  const { results, specialty } = state;
  const [sortBy, setSortBy] = useState('rating');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Distance calculation function
  const calculateDistance = (doctorLat, doctorLng) => {
    if (!userLocation || !doctorLat || !doctorLng) return null;
    
    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(doctorLat);
    const lon2 = parseFloat(doctorLng);
    
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

  const sortedDoctors = [...results].sort((a, b) => {
    switch(sortBy) {
      case 'rating': 
        return (b.rating || 0) - (a.rating || 0);
      case 'experience': 
        return b.experience - a.experience;
      case 'fee': 
        return a.consultationFees - b.consultationFees;
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {specialty} Specialists ({results.length})
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
                <option value="fee">Consultation Fee</option>
                <option value="distance">Distance</option>
              </select>
              <button
                onClick={handleNearMe}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaMapMarkerAlt />
                Near Me
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <FaUserMd className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.experience} years exp.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doctor.specialization}</div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-500">{doctor.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{doctor.city}</div>
                      {userLocation && (
                        <div className="text-sm text-blue-600">
                          {calculateDistance(doctor.latitude, doctor.longitude)} km away
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">₹{doctor.consultationFees}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowProfile(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>View Profile</span>
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <FaDirections className="w-4 h-4" />
                          <span>Directions</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedDoctor && (
          <DoctorProfile
            doctor={selectedDoctor}
            distance={calculateDistance(selectedDoctor.latitude, selectedDoctor.longitude)}
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

export default SpecialtyResults;