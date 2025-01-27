import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaHospital, FaUserMd, FaStethoscope, FaClinicMedical,
  FaInfoCircle, FaRegQuestionCircle, FaAmbulance, FaPills,
  FaHeartbeat, FaBars, FaTimes, FaUserCircle 
} from 'react-icons/fa';

const UserNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Hospitals', path: '/usernavhospitals', icon: <FaHospital className="w-5 h-5" /> },
    { name: 'Clinics', path: '/clinics', icon: <FaClinicMedical className="w-5 h-5" /> },
    { name: 'Doctors', path: '/usernavdoctors', icon: <FaUserMd className="w-5 h-5" /> },
    {
      name: 'Services',
      icon: <FaStethoscope className="w-5 h-5" />,
      subItems: [
        { name: 'Emergency Care', path: '/emergency', icon: <FaAmbulance className="w-5 h-5" /> },
        { name: 'Pharmacy', path: '/pharmacy', icon: <FaPills className="w-5 h-5" /> },
        { name: 'Health Checkup', path: '/checkup', icon: <FaHeartbeat className="w-5 h-5" /> },
      ]
    },
    { name: 'About Us', path: '/usernavabout', icon: <FaInfoCircle className="w-5 h-5" /> },
    { name: 'Help', path: '/usernavhelp', icon: <FaRegQuestionCircle className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <img src="/logo.png" alt="Medico" className="h-8 w-auto mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
                             bg-clip-text text-transparent">Medico</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative" ref={dropdownRef}>
                {item.subItems ? (
                  <motion.button
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    className={`px-4 py-2 rounded-md inline-flex items-center space-x-2
                              ${activeDropdown === item.name ? 'text-blue-600 bg-blue-50' : 
                              'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </motion.button>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-md inline-flex items-center space-x-2
                                ${location.pathname === item.path ? 
                                'text-blue-600 bg-blue-50' : 
                                'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.subItems && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-48 py-2 mt-1 bg-white rounded-xl 
                               shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.name}
                          whileHover={{ x: 5 }}
                        >
                          <Link
                            to={subItem.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 
                                     hover:bg-blue-50 hover:text-blue-600"
                          >
                            {subItem.icon}
                            <span className="ml-2">{subItem.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Login Button - Desktop */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/userlogin"
                className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full 
                         hover:bg-blue-700 transition-colors duration-300 flex items-center"
              >
                <FaUserCircle className="mr-2" />
                Login
              </Link>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Login Button - Mobile */}
            <Link
              to="/userlogin"
              className="px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              <FaUserCircle className="w-6 h-6" />
            </Link>

            {/* Hamburger Menu */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 
                       hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </motion.button>
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
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center px-3 py-2 rounded-md text-gray-600 
                                 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pl-6 space-y-1"
                          >
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="flex items-center px-3 py-2 rounded-md text-sm 
                                         text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                              >
                                {subItem.icon}
                                <span className="ml-2">{subItem.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-gray-600 
                               hover:text-blue-600 hover:bg-blue-50"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserNav;