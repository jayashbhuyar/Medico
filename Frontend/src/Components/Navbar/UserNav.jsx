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
  FaUserCircle,
  FaChevronDown,
  FaSignInAlt,
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
    { name: "Home", path: "/", icon: <FaHome className="w-5 h-5" /> },
    {
      name: "Hospitals",
      path: "/usernavhospitals",
      icon: <FaHospital className="w-5 h-5" />,
    },
    {
      name: "Clinics",
      path: "/clinics",
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                           bg-clip-text text-transparent hover:from-indigo-600 hover:to-blue-600
                           transition-all duration-300"
            >
              Medico
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.subItems ? (
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                    className={`flex items-center px-4 py-2.5 rounded-xl group 
                              ${
                                location.pathname === item.path
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                  : "text-gray-700 hover:bg-blue-50"
                              }
                              transition-all duration-200 hover:shadow-md`}
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    {item.name}
                    <FaChevronDown
                      className="ml-2 text-sm transition-transform duration-200 
                                           group-hover:rotate-180"
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 rounded-xl
                              ${
                                location.pathname === item.path
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                  : "text-gray-700 hover:bg-blue-50 hover:shadow-md"
                              }
                              transition-all duration-200`}
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.subItems && activeDropdown === item.name && (
                  <div
                    className="absolute top-full right-0 w-56 mt-2 p-1
                                bg-white/80 backdrop-blur-md rounded-xl shadow-xl 
                                border border-blue-100"
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="flex items-center px-4 py-3 rounded-lg text-gray-700 
                                 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500
                                 hover:text-white transition-all duration-200"
                      >
                        <span className="mr-2">{subItem.icon}</span>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Login Button */}
            <Link
              to="/userlogin"
              className="ml-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 
                         transition-all duration-200 flex items-center font-medium"
            >
              <FaSignInAlt className="mr-2" />
              Login / Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-blue-50 
                       transition-all duration-200 hover:shadow-md"
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
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

                {/* Mobile Login Button */}
                <Link
                  to="/userlogin"
                  className="block mx-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-white rounded-lg text-center font-medium hover:shadow-lg 
                           transition-all duration-200"
                >
                  <FaSignInAlt className="inline mr-2" />
                  Login / Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default UserNav;