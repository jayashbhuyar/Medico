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
          {/* Doctor Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserMd className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialization}</p>
                {distance && <p className="text-blue-600">{distance} km away</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Practice Details</h3>
              <p className="text-gray-600"><FaHospital className="inline mr-2" />{doctor.organizationName}</p>
              <p className="text-gray-600"><FaRupeeSign className="inline mr-2" />₹{doctor.consultationFees}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Available Days</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {daysOfWeek.map(day => (
                  <div
                    key={day}
                    className={`p-2 rounded text-center ${
                      doctor.availability?.includes(day)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => toast.info('Please login to book appointment')}
                className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mr-2"
              >
                Book Appointment
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-center"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;