import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaHospital,
  FaUserMd,
  FaStethoscope,
  FaClinicMedical,
  FaInfoCircle,
  FaRegQuestionCircle,
  FaAmbulance,
  FaPills,
  FaHeartbeat,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaChevronDown,
} from "react-icons/fa";

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/patientpage", icon: <FaHome className="w-5 h-5" /> },
    {
      name: "Hospitals",
      path: "/usernavhospitals",
      icon: <FaHospital className="w-5 h-5" />,
    },
    {
      name: "Clinics",
      path: "/usernavclinic",
      icon: <FaClinicMedical className="w-5 h-5" />,
    },
    {
      name: "Doctors",
      path: "/usernavdoctors",
      icon: <FaUserMd className="w-5 h-5" />,
    },
    {
      name: "Services",
      icon: <FaStethoscope className="w-5 h-5" />,
      subItems: [
        {
          name: "Emergency Care",
          path: "/emergency",
          icon: <FaAmbulance className="w-5 h-5" />,
        },
        {
          name: "Pharmacy",
          path: "/pharmacy",
          icon: <FaPills className="w-5 h-5" />,
        },
        {
          name: "Health Checkup",
          path: "/checkup",
          icon: <FaHeartbeat className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "About Us",
      path: "/usernavabout",
      icon: <FaInfoCircle className="w-5 h-5" />,
    },
    {
      name: "Help",
      path: "/usernavhelp",
      icon: <FaRegQuestionCircle className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-white px-3 py-1.5 rounded-lg shadow-lg border border-gray-300"
            >
              {/* Logo Text */}
              <span className="text-2xl font-bold text-[#2C3E50] tracking-wide">
                Medico
              </span>
              <span className="ml-2 text-sm text-[#16A085] uppercase font-medium tracking-wider">
                Healthcare
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                {item.subItems ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    className={`flex items-center px-4 py-2 rounded-xl group relative
                              ${location.pathname === item.path 
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                                : "text-gray-700 hover:bg-gray-50"}
                              transition-all duration-300`}
                  >
                    <span className="mr-2 text-blue-600 group-hover:text-indigo-600 
                                   transition-colors duration-300">
                      {item.icon}
                    </span>
                    {item.name}
                    <motion.span
                      animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-2"
                    >
                      <FaChevronDown className="text-sm" />
                    </motion.span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-xl relative
                              ${location.pathname === item.path 
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                                : "text-gray-700 hover:bg-gray-50"}
                              transition-all duration-300`}
                  >
                    <span className="mr-2 text-blue-600 group-hover:text-indigo-600 
                                   transition-colors duration-300">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.subItems && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 w-56 mt-2 p-1
                               bg-white rounded-xl shadow-lg border border-gray-100"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.name}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <Link
                            to={subItem.path}
                            className="flex items-center px-4 py-3 rounded-lg text-gray-700 
                                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                                     transition-all duration-300"
                          >
                            <span className="mr-2 text-blue-600">{subItem.icon}</span>
                            {subItem.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/userlogin"
                className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-700 to-blue-400 
                         text-white rounded-xl shadow-md hover:shadow-lg
                         transition-all duration-300 flex items-center font-medium"
              >
                <FaSignInAlt className="mr-2" />
                Login 
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/userlogin"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white rounded-xl shadow-md hover:shadow-lg
                         transition-all duration-300 flex items-center font-medium"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
            </motion.div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-50 
                         transition-all duration-200 hover:shadow-md"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden py-4 bg-white/80 backdrop-blur-md rounded-xl mt-2 shadow-xl"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          )
                        }
                        className="w-full flex items-center px-4 py-3 text-gray-700 
                                 hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                        <FaChevronDown
                          className={`ml-auto transform transition-transform duration-200
                          ${activeDropdown === item.name ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className="w-full flex items-center px-4 py-3 text-gray-700 
                                 hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </Link>
                    )}

                    {/* Mobile Dropdown */}
                    <AnimatePresence>
                      {item.subItems && activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-gray-50 py-2"
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="flex items-center px-8 py-3 text-gray-700 
                                       hover:bg-blue-50 transition-colors"
                            >
                              <span className="mr-2">{subItem.icon}</span>
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default UserNav;