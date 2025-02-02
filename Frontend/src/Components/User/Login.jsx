import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaEnvelope, FaPhone, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {/* Maintenance Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block text-blue-500 mb-4"
            >
              <FaTools className="w-16 h-16" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Service Temporarily Unavailable
            </h2>
            <p className="text-gray-600 text-lg">
              We're currently enhancing our patient login system to serve you better.
            </p>
          </div>

          {/* Status Information */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">
                System Status
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our patient portal is undergoing scheduled maintenance. Expected completion:
              <span className="font-semibold"> 48 hours</span>
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-2" />
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Alternative Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Need Immediate Assistance?
              </h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <FaPhone className="mr-2" />
                  Emergency: <span className="font-semibold ml-2">108</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <FaPhone className="mr-2" />
                  Helpline: <span className="font-semibold ml-2">1800-123-4567</span>
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Contact Support
              </h3>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  Email: support@medico.com
                </p>
                <p className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  Available 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/patientpage">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                Return to Homepage
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-8 py-3 border-2 border-blue-600 text-blue-600 
                       rounded-lg hover:bg-blue-50 transition duration-300 flex items-center justify-center"
            >
              Check Status Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;