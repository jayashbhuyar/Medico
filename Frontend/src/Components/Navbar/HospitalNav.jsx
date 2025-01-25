import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHospital, FaUserMd, FaCalendarCheck, FaChartLine,
  FaBell, FaSearch, FaUserCircle, FaBars, FaTimes,
  FaAmbulance, FaBed, FaStethoscope, FaUserNurse,
  FaPlusCircle, FaList, FaClock, FaCheckCircle,
  FaTimesCircle, FaCaretDown, FaUserPlus, FaCog,
  FaSignOutAlt, FaFileMedical, FaUsers
} from 'react-icons/fa';

const HospitalNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDoctorsDropdown, setShowDoctorsDropdown] = useState(false);
  const [showAppointmentsDropdown, setShowAppointmentsDropdown] = useState(false);
  const [showDepartmentsDropdown, setShowDepartmentsDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const navigation = [
    { name: 'Dashboard', path: '/hospital/dashboard', icon: <FaChartLine /> },
    { 
      name: 'Doctors', 
      icon: <FaUserNurse />,
      dropdown: true,
      items: [
        { name: 'All Doctors', path: '/hospital/doctors', icon: <FaUserMd /> },
        { name: 'Add Doctor', path: '/hospital/doctors/add', icon: <FaUserPlus /> }
      ]
    },
    { 
      name: 'Appointments', 
      icon: <FaCalendarCheck />,
      dropdown: true,
      items: [
        { name: 'Pending', path: '/hospital/appointments/pending', icon: <FaClock /> },
        { name: 'Completed', path: '/hospital/appointments/completed', icon: <FaCheckCircle /> },
        { name: 'Cancelled', path: '/hospital/appointments/cancelled', icon: <FaTimesCircle /> }
      ]
    },
    {
      name: 'Departments',
      icon: <FaHospital />,
      dropdown: true,
      items: [
        { name: 'Emergency', path: '/hospital/departments/emergency', icon: <FaAmbulance /> },
        { name: 'ICU', path: '/hospital/departments/icu', icon: <FaBed /> },
        { name: 'OPD', path: '/hospital/departments/opd', icon: <FaStethoscope /> }
      ]
    },
    {
      name: 'Patients',
      icon: <FaUsers />,
      dropdown: true,
      items: [
        { name: 'All Patients', path: '/hospital/patients', icon: <FaUsers /> },
        { name: 'Add Patient', path: '/hospital/patients/add', icon: <FaUserPlus /> },
        { name: 'Medical Records', path: '/hospital/patients/records', icon: <FaFileMedical /> }
      ]
    }
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDoctorsDropdown(false);
        setShowAppointmentsDropdown(false);
        setShowDepartmentsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    setShowDoctorsDropdown(type === 'doctors' ? !showDoctorsDropdown : false);
    setShowAppointmentsDropdown(type === 'appointments' ? !showAppointmentsDropdown : false);
    setShowDepartmentsDropdown(type === 'departments' ? !showDepartmentsDropdown : false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/hospital/dashboard" className="flex items-center space-x-2">
              <FaHospital className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">HospitalCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search patients, doctors..."
                className="w-64 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>

            {/* Navigation Links */}
            {navigation.map((item) => (
              item.dropdown ? (
                <div 
                  key={item.name}
                  ref={dropdownRef}
                  className="relative"
                >
                  <button 
                    onClick={() => toggleDropdown(item.name.toLowerCase())}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                    <FaCaretDown className={`ml-2 transform transition-transform duration-200 ${
                      (item.name.toLowerCase() === 'doctors' && showDoctorsDropdown) || 
                      (item.name.toLowerCase() === 'appointments' && showAppointmentsDropdown) ||
                      (item.name.toLowerCase() === 'departments' && showDepartmentsDropdown)
                        ? 'rotate-180' 
                        : ''
                    }`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {((item.name.toLowerCase() === 'doctors' && showDoctorsDropdown) || 
                    (item.name.toLowerCase() === 'appointments' && showAppointmentsDropdown) ||
                    (item.name.toLowerCase() === 'departments' && showDepartmentsDropdown)) && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => toggleDropdown(item.name.toLowerCase())}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${location.pathname === item.path 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              )
            ))}

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <FaBell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <img
                  src="https://via.placeholder.com/32"
                  alt="Profile"
                  className="h-8 w-8 rounded-full border-2 border-blue-500"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">Hospital Admin</p>
                    <p className="text-sm text-gray-500">admin@hospital.com</p>
                  </div>
                  <Link to="/hospital/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                  <Link to="/hospital/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaCog className="mr-2" />
                    Settings
                  </Link>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header Right */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <img
                src="https://via.placeholder.com/32"
                alt="Profile"
                className="h-8 w-8 rounded-full border-2 border-blue-500"
              />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name.toLowerCase())}
                      className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                      <FaCaretDown className="ml-2" />
                    </button>
                    {((item.name.toLowerCase() === 'doctors' && showDoctorsDropdown) || 
                      (item.name.toLowerCase() === 'appointments' && showAppointmentsDropdown) ||
                      (item.name.toLowerCase() === 'departments' && showDepartmentsDropdown)) && (
                      <div className="pl-6 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={() => {
                              toggleDropdown(item.name.toLowerCase());
                              setIsOpen(false);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <span className="mr-2">{subItem.icon}</span>
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium
                      ${location.pathname === item.path 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default HospitalNavbar;