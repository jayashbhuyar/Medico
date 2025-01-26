import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaHospital, FaClinicMedical, FaUserMd,
  FaInfoCircle, FaPhone, FaBars, FaTimes, FaBell,
  FaStethoscope, FaAmbulance, FaPills, FaHeartbeat,
  FaChevronDown, FaSearch, FaRegQuestionCircle
} from 'react-icons/fa';

const UserNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome className="text-blue-500" /> },
    { name: 'Hospitals', path: '/hospitals', icon: <FaHospital className="text-blue-500" /> },
    { name: 'Clinics', path: '/clinics', icon: <FaClinicMedical className="text-blue-500" /> },
    { name: 'Doctors', path: '/doctors', icon: <FaUserMd className="text-blue-500" /> },
    {
      name: 'Services',
      icon: <FaStethoscope className="text-blue-500" />,
      subItems: [
        { name: 'Emergency Care', path: '/emergency', icon: <FaAmbulance className="text-red-500" /> },
        { name: 'Pharmacy', path: '/pharmacy', icon: <FaPills className="text-green-500" /> },
        { name: 'Health Checkup', path: '/checkup', icon: <FaHeartbeat className="text-pink-500" /> },
      ]
    },
    { name: 'About Us', path: '/about', icon: <FaInfoCircle className="text-blue-500" /> },
    { name: 'Help', path: '/help', icon: <FaRegQuestionCircle className="text-blue-500" /> },
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <FaHeartbeat className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                             bg-clip-text text-transparent">MediCare</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search Bar */}
            {/* <div className="relative mr-4">
              <motion.div
                animate={{ width: showSearch ? 'auto' : '40px' }}
                className="flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className={`${
                    showSearch ? 'w-64 pl-10 pr-4' : 'w-0'
                  } py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 
                    transition-all duration-300`}
                />
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="absolute left-3 text-gray-400 hover:text-blue-500"
                >
                  <FaSearch />
                </button>
              </motion.div>
            </div> */}

            {/* Navigation Items */}
            {navItems.map((item) => (
              <div key={item.name} className="relative group" ref={dropdownRef}>
                {item.subItems ? (
                  <>
                    <motion.button
                      whileHover={{ y: -2 }}
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 
                               hover:bg-blue-50 font-medium flex items-center space-x-1"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                      <FaChevronDown className={`transform transition-transform duration-200
                        ${isServicesOpen ? 'rotate-180' : ''}`} />
                    </motion.button>
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-48 rounded-xl shadow-lg bg-white 
                                   ring-1 ring-black ring-opacity-5 overflow-hidden"
                        >
                          {item.subItems.map((subItem) => (
                            <motion.div
                              key={subItem.name}
                              whileHover={{ x: 2, backgroundColor: '#EFF6FF' }}
                            >
                              <Link
                                to={subItem.path}
                                className="block px-4 py-2 text-gray-600 hover:text-blue-600
                                         flex items-center space-x-2"
                              >
                                <span>{subItem.icon}</span>
                                <span>{subItem.name}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                        ${location.pathname === item.path 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}

            {/* Notification Bell */}
            {/* <button className="relative p-2 hover:bg-blue-50 rounded-full transition-colors duration-200">
              <FaBell className="h-5 w-5 text-gray-600 hover:text-blue-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white 
                             flex items-center justify-center">2</span>
            </button> */}

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/userlogin"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 
                         text-white hover:from-blue-500 hover:to-blue-300 transition-all duration-300
                         shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/userlogin"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 
                       text-white text-sm hover:from-blue-500 hover:to-blue-300"
            >
              Login
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                       hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <motion.div 
                  key={item.name}
                  whileHover={{ x: 4 }}
                >
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className="w-full px-3 py-2 rounded-md text-base font-medium 
                                 text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                                 flex items-center justify-between"
                      >
                        <span className="flex items-center">
                          <span className="mr-2">{item.icon}</span>
                          {item.name}
                        </span>
                        <FaChevronDown className={`transform transition-transform duration-200
                          ${isServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pl-4"
                          >
                            {item.subItems.map((subItem) => (
                              <motion.div
                                key={subItem.name}
                                whileHover={{ x: 4 }}
                              >
                                <Link
                                  to={subItem.path}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-3 py-2 rounded-md text-base font-medium 
                                           text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                                           flex items-center"
                                >
                                  <span className="mr-2">{subItem.icon}</span>
                                  {subItem.name}
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium 
                               text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                               flex items-center"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserNav;