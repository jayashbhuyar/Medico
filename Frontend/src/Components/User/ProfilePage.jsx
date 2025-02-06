import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendar, 
  FaMars, FaHome, FaEdit, FaBell
} from 'react-icons/fa';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-100 border-4 border-white shadow-xl 
                                flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pl-44 bg-gradient-to-t from-black/60">
              <h1 className="text-4xl font-bold text-white mb-2">
                {`${userData.firstName} ${userData.lastName}`}
              </h1>
              <p className="text-blue-100">{userData.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField icon={<FaPhone />} label="Phone" value={userData.phone} />
                <InfoField icon={<FaCalendar />} label="Date of Birth" value={new Date(userData.dateOfBirth).toLocaleDateString()} />
                <InfoField icon={<FaMars />} label="Gender" value={userData.gender} />
                <InfoField icon={<FaHome />} label="Address" value={userData.address} />
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaBell className="text-blue-600" />
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                {Object.entries(userData.notificationPreferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        className="sr-only peer"
                        onChange={() => {}}
                      />
                      <div className={`w-11 h-6 bg-gray-200 rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:bg-blue-600
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all`}>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ icon, label, value }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <p className="text-lg font-medium text-gray-900">{value}</p>
  </div>
);

export default ProfilePage;