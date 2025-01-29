import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUserMd, FaCalendarCheck, FaChartLine, 
  FaBell, FaSearch, FaUserCircle, FaBars, FaTimes,
  FaPrescription, FaHospital, FaUserNurse, FaCaretDown,
  FaCheckCircle, FaClock, FaTimesCircle, FaUserPlus
} from 'react-icons/fa';

const ClinicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDoctorsDropdown, setShowDoctorsDropdown] = useState(false);
  const [showAppointmentsDropdown, setShowAppointmentsDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const navigation = [
    { name: 'Dashboard', path: '/clinic/dashboard', icon: <FaChartLine /> },
    { 
      name: 'Appointments', 
      icon: <FaCalendarCheck />,
      dropdown: true,
      items: [
        { name: 'Completed', path: '/clinic/appointments/completed', icon: <FaCheckCircle /> },
        { name: 'Pending', path: '/clinic/appointments/pending', icon: <FaClock /> },
        { name: 'Cancelled', path: '/clinic/appointments/cancelled', icon: <FaTimesCircle /> }
      ]
    },
    { 
      name: 'Doctors', 
      icon: <FaUserNurse />,
      dropdown: true,
      items: [
        { name: 'All Doctors', path: '/clinic/doctors', icon: <FaUserMd /> },
        { name: 'Add Doctor', path: '/clinicadddoctor', icon: <FaUserPlus /> }
      ]
    },
    { name: 'Patients', path: '/clinic/patients', icon: <FaUserMd /> },
    { name: 'Prescriptions', path: '/clinic/prescriptions', icon: <FaPrescription /> }
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDoctorsDropdown(false);
        setShowAppointmentsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    if (type === 'doctors') {
      setShowDoctorsDropdown(!showDoctorsDropdown);
      setShowAppointmentsDropdown(false);
    } else {
      setShowAppointmentsDropdown(!showAppointmentsDropdown);
      setShowDoctorsDropdown(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/clinic/dashboard" className="flex items-center space-x-2">
              <FaHospital className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">ClinicCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search..."
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
                      (item.name === 'Doctors' && showDoctorsDropdown) || 
                      (item.name === 'Appointments' && showAppointmentsDropdown) 
                        ? 'rotate-180' 
                        : ''
                    }`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {((item.name === 'Doctors' && showDoctorsDropdown) || 
                    (item.name === 'Appointments' && showAppointmentsDropdown)) && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ease-in-out">
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

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
              >
                <FaUserCircle className="h-6 w-6 text-gray-600" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link to="/clinic/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/clinic/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                    {((item.name === 'Doctors' && showDoctorsDropdown) || 
                      (item.name === 'Appointments' && showAppointmentsDropdown)) && (
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
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
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

export default ClinicNav;