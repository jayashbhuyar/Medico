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
import Cookies from 'js-cookie';

const HospitalNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    doctors: false,
    departments: false,
    patients: false
  });
  
  const location = useLocation();
  const dropdownRefs = {
    doctors: useRef(null),
    departments: useRef(null),
    patients: useRef(null),
    profile: useRef(null)
  };

  const toggleDropdown = (key) => {
    setDropdownStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownStates(prev => ({
            ...prev,
            [key]: false
          }));
        }
      });
      
      if (!dropdownRefs.profile.current?.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const data=JSON.parse(localStorage.getItem('hospitalData'));
  // console.log(data)
  // console.log(data.image)
  const handleLogout = () => {  localStorage.removeItem('hospitalData');
    Cookies.remove('hospitalToken');
    Navigate('/hospitallogin');
  }

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

            {/* Dashboard Link */}
            <Link
              to="/hospital/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/hospital/dashboard' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FaChartLine className="mr-2" />
              Dashboard
            </Link>

            {/* Doctors Dropdown */}
            <div ref={dropdownRefs.doctors} className="relative">
              <button
                onClick={() => toggleDropdown('doctors')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <FaUserNurse className="mr-2" />
                Doctors
                <FaCaretDown
                  className={`ml-2 transition-transform duration-200 ${
                    dropdownStates.doctors ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownStates.doctors && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/hospital/alldoctors"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      doctors: false,
                    }))}
                  >
                    <FaUserMd className="mr-2" />
                    All Doctors
                  </Link>
                  <Link
                    to="/hospital/adddoctor"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      doctors: false,
                    }))}
                  >
                    <FaUserPlus className="mr-2" />
                    Add Doctor
                  </Link>
                </div>
              )}
            </div>

            {/* Appointments Link (No Dropdown) */}
            <Link
              to="/hospital/appointments"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/hospital/appointments' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FaCalendarCheck className="mr-2" />
              Appointments
            </Link>

            {/* Departments Dropdown */}
            <div ref={dropdownRefs.departments} className="relative">
              <button
                onClick={() => toggleDropdown('departments')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <FaHospital className="mr-2" />
                Departments
                <FaCaretDown
                  className={`ml-2 transition-transform duration-200 ${
                    dropdownStates.departments ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownStates.departments && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/hospital/departments/emergency"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      departments: false,
                    }))}
                  >
                    <FaAmbulance className="mr-2" />
                    Emergency
                  </Link>
                  <Link
                    to="/hospital/departments/icu"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      departments: false,
                    }))}
                  >
                    <FaBed className="mr-2" />
                    ICU
                  </Link>
                  <Link
                    to="/hospital/departments/opd"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      departments: false,
                    }))}
                  >
                    <FaStethoscope className="mr-2" />
                    OPD
                  </Link>
                </div>
              )}
            </div>

            {/* Patients Dropdown */}
            <div ref={dropdownRefs.patients} className="relative">
              <button
                onClick={() => toggleDropdown('patients')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <FaUsers className="mr-2" />
                Patients
                <FaCaretDown
                  className={`ml-2 transition-transform duration-200 ${
                    dropdownStates.patients ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownStates.patients && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/hospital/patients"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      patients: false,
                    }))}
                  >
                    <FaUsers className="mr-2" />
                    All Patients
                  </Link>
                  <Link
                    to="/hospital/patients/add"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      patients: false,
                    }))}
                  >
                    <FaUserPlus className="mr-2" />
                    Add Patient
                  </Link>
                  <Link
                    to="/hospital/patients/records"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setDropdownStates((prev) => ({
                      ...prev,
                      patients: false,
                    }))}
                  >
                    <FaFileMedical className="mr-2" />
                    Medical Records
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <FaBell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div ref={dropdownRefs.profile} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <img
                  src={data.image||"https://via.placeholder.com/32"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border-2 border-blue-500"
                />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{data.hospitalName}</p>
                    <p className="text-sm text-gray-500">{data.email}</p>
                  </div>
                  <Link 
                    to="/hospital/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    Profile
                  </Link>
                  <Link 
                    to="/hospital/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaCog className="mr-2" />
                    Settings
                  </Link>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={handleLogout}>
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
                    {dropdownStates[item.name.toLowerCase()] && (
                      <div className="pl-6 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
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
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
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