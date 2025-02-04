import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserMd, FaStar, FaMoneyBillWave, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [sortBy, setSortBy] = useState('rating');

  const sortedDoctors = [...results].sort((a, b) => {
    switch(sortBy) {
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'experience': return b.experience - a.experience;
      case 'fee': return a.consultationFees - b.consultationFees;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Doctors matching "{searchTerm}" ({results.length})
            </h1>
            <select 
              className="border-2 rounded-md p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="fee">Sort by Fee</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden border"
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <FaUserMd className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialties.join(', ')}</p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`w-4 h-4 ${i < (doctor.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
          {doctor.location?.address || 'Location not specified'}
        </p>
        <p className="flex items-center">
          <FaMoneyBillWave className="w-4 h-4 mr-2" />
          ₹{doctor.consultationFees} Consultation Fee
        </p>
        <p className="flex items-center">
          <FaClock className="w-4 h-4 mr-2" />
          {doctor.experience} years experience
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          Book Appointment
        </button>
        <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition duration-300">
          View Profile
        </button>
      </div>
    </div>
  </motion.div>
);

export default DoctorResults;