import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaHospital, FaClinicMedical, FaMapMarkerAlt, 
         FaClock, FaPhone, FaEnvelope, FaCalendarAlt, FaTimes, FaRupeeSign } from 'react-icons/fa';

const DoctorProfile = ({ doctor, distance, onClose }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Doctor Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserMd className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.degrees.join(", ")}</p>
                <p className="text-blue-600">{doctor.experience} years experience</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>

          {/* Organization Info */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Practice Location</h3>
            <p className="flex items-center text-gray-600">
              <FaHospital className="mr-2" />
              {doctor.organizationName} ({doctor.organizationType})
            </p>
            <p className="flex items-center text-gray-600 mt-1">
              <FaMapMarkerAlt className="mr-2" />
              {doctor.address}, {doctor.city}, {doctor.state}
              {distance && <span className="ml-2 text-blue-600">({distance} km away)</span>}
            </p>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties.map((specialty, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Available Days</h3>
            <div className="grid grid-cols-3 gap-2">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className={`p-2 text-center rounded ${
                    doctor.availableDays.includes(day)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <p className="mt-2 text-gray-600">
              <FaClock className="inline mr-2" />
              {doctor.timeSlots.start} - {doctor.timeSlots.end}
            </p>
          </div>

          {/* Consultation Fee */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Consultation Fee</h3>
            <p className="text-2xl font-bold text-green-600">
              <FaRupeeSign className="inline text-xl" />
              {doctor.consultationFees}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => toast.info('Please login to book appointment')}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Book Appointment
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaMapMarkerAlt />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;