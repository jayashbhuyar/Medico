import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHospital, 
  FaUserMd, 
  FaCalendarCheck, 
  FaStar, 
  FaComments, 
  FaUser,
  FaChevronDown,
  FaPlusCircle,
  FaList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const HospitalNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownMenus = {
    doctors: [
      { title: 'Add Doctor', icon: <FaPlusCircle />, path: '/hospital/doctors/add' },
      { title: 'All Doctors', icon: <FaList />, path: '/hospital/doctors/all' }
    ],
    appointments: [
      { title: 'Pending', icon: <FaClock />, path: '/hospital/appointments/pending' },
      { title: 'Completed', icon: <FaCheckCircle />, path: '/hospital/appointments/completed' },
      { title: 'Cancelled', icon: <FaTimesCircle />, path: '/hospital/appointments/cancelled' }
    ]
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Hospital Name */}
          <Link to="/hospital/dashboard" className="flex items-center space-x-3">
            <FaHospital className="h-8 w-8" />
            <span className="font-bold text-xl">Hospital Name</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Doctors Dropdown */}
            <div className="relative group"
                 onMouseEnter={() => setActiveDropdown('doctors')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center space-x-2 hover:text-blue-200">
                <FaUserMd />
                <span>Doctors</span>
                <FaChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'doctors' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white text-gray-700"
                  >
                    {dropdownMenus.doctors.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-blue-50 transition-colors"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Appointments Dropdown */}
            <div className="relative group"
                 onMouseEnter={() => setActiveDropdown('appointments')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center space-x-2 hover:text-blue-200">
                <FaCalendarCheck />
                <span>Appointments</span>
                <FaChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'appointments' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white text-gray-700"
                  >
                    {dropdownMenus.appointments.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-blue-50 transition-colors"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reviews */}
            <Link to="/hospital/reviews" className="flex items-center space-x-2 hover:text-blue-200">
              <FaStar />
              <span>Reviews</span>
            </Link>

            {/* Comments */}
            <Link to="/hospital/comments" className="flex items-center space-x-2 hover:text-blue-200">
              <FaComments />
              <span>Comments</span>
            </Link>

            {/* Profile */}
            <Link to="/hospital/profile" className="flex items-center space-x-2 hover:text-blue-200">
              <FaUser />
              <span>Profile</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-blue-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile menu items */}
              {/* Add your mobile menu items here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default HospitalNavbar;