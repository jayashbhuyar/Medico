import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaHospital, FaClinicMedical, FaMapMarkerAlt, 
         FaClock, FaPhone, FaEnvelope, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const DoctorProfile = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="border-b p-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserMd className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.degrees.join(", ")}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Organization Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              {doctor.organizationType === "Hospital" ? <FaHospital /> : <FaClinicMedical />}
              {doctor.organizationType}
            </h3>
            <p className="text-gray-700">{doctor.organizationName}</p>
            <p className="text-gray-600 text-sm">{doctor.organizationEmail}</p>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((specialty, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Experience & Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Experience</h3>
              <p>{doctor.experience} years</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Consultation Fee</h3>
              <p>₹{doctor.consultationFees}</p>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaClock />
                <span>{doctor.timeSlots.start} - {doctor.timeSlots.end}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.availableDays.map((day, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {doctor.phone}
                </p>
                {doctor.alternatePhone && (
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {doctor.alternatePhone}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {doctor.email}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                {doctor.address}, {doctor.city}, {doctor.state}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <button 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 
                     transition duration-300 flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            Book Appointment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorProfile;