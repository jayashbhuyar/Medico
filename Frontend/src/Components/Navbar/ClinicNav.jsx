import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaUserNurse,
  FaCaretDown,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import Cookies from "js-cookie";

const ClinicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDoctorsDropdown, setShowDoctorsDropdown] = useState(false);
  const [showPatientsDropdown, setShowPatientsDropdown] = useState(false);
  const [showAppointmentsDropdown, setShowAppointmentsDropdown] =
    useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const doctorsRef = useRef(null);
  const patientsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const navigate = useNavigate();

  const clinicData = JSON.parse(localStorage.getItem("clinicData"));

  const handleLogout = () => {
    Cookies.remove("clinicToken");
    localStorage.removeItem("clinicData");
    navigate("/cliniclogin");
  };

  const navigation = [
    { name: "Dashboard", path: "/clinic/dashboard", icon: <FaChartLine /> },
    {
      name: "Appointments",
      path: "/clinic/appointments",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Doctors",
      icon: <FaUserNurse />,
      dropdown: true,
      items: [
        { name: "All Doctors", path: "/clinicalldoctors", icon: <FaUserMd /> },
        { name: "Add Doctor", path: "/clinicadddoctor", icon: <FaUserPlus /> },
      ],
    },
    {
      name: "Patients",
      icon: <FaUsers />,
      dropdown: true,
      items: [
        {
          name: "All Patients",
          path: "/clinic/patients/all",
          icon: <FaUsers />,
        },
        { name: "Add Patient", path: "/addpatient", icon: <FaUserPlus /> },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none md:hidden"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            <Link
              to="/clinic/dashboard"
              className="text-xl font-bold text-blue-700"
            >
              Clinic Portal
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {navigation.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-2 text-gray-700 hover:text-blue-600`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Profile Menu */}
          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 h-10 px-3 hover:bg-gray-100 
                       transition-colors rounded-md"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                {clinicData?.image ? (
                  <img
                    src={clinicData.image}
                    alt={clinicData.clinicName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 
                       flex items-center justify-center text-white font-semibold"
                  >
                    {clinicData?.clinicName?.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-gray-700 font-medium">
                {clinicData?.clinicName}
              </span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white 
                             rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  {/* Clinic Info Section */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md">
                      {clinicData?.image ? (
                        <img 
                          src={clinicData.image} 
                          alt={clinicData.clinicName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-r 
                                      from-blue-500 to-blue-600 flex items-center justify-center 
                                      text-white font-bold text-xl">
                          {clinicData?.clinicName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {clinicData?.clinicName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {clinicData?.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2">
                    <Link
                      to="/clinicprofile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 
                                 rounded-xl transition-colors"
                    >
                      <FaUser className="text-blue-600 w-5 h-5" />
                      <span className="text-gray-700 font-medium">
                        My Profile
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 
                                 hover:bg-red-50 hover:text-red-600 w-full rounded-xl 
                                 transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col pt-2 pb-3 space-y-1">
              {navigation.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClinicNav;
