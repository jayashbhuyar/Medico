import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaClinicMedical, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ClinicResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Clinics matching "{searchTerm}" ({results.length})
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((clinic) => (
              <ClinicCard key={clinic._id} clinic={clinic} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClinicCard = ({ clinic }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden border"
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <FaClinicMedical className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{clinic.name}</h3>
          <p className="text-gray-600">{clinic.specialization}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
          {clinic.location?.address || 'Location not specified'}
        </p>
        <p className="flex items-center">
          <FaPhone className="w-4 h-4 mr-2" />
          {clinic.phone}
        </p>
        <p className="flex items-center">
          <FaEnvelope className="w-4 h-4 mr-2" />
          {clinic.email}
        </p>
      </div>

      <div className="mt-6">
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

export default ClinicResults;