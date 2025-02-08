import React from "react";
import { Link } from "react-router-dom";
import {
  FaHospital,
  FaUserMd,
  FaUser,
  FaSearch,
  FaStar,
  FaQuestionCircle,
} from "react-icons/fa";

const SiteMap = () => {
  const sections = [
    {
      title: "User Portal",
      icon: <FaUser className="text-blue-500" />,
      items: [
        { name: "User Login", path: "/userlogin" },
        { name: "Healthcare Search", path: "/healthcare-search" },
        { name: "User Dashboard", path: "/user/mainpage" },
        { name: "My Appointments", path: "/user/appointments" },
        { name: "Profile Settings", path: "/profile" },
      ],
    },
    {
      title: "Hospital Services",
      icon: <FaHospital className="text-green-500" />,
      items: [
        { name: "Hospital Registration", path: "/hospitalregistration" },
        { name: "Hospital Login", path: "/hospitallogin" },
        { name: "Hospital Dashboard", path: "/hospital/dashboard" },
        { name: "Add Doctor", path: "/hospital/add-doctor" },
        { name: "View All Doctors", path: "/hospital/all-doctors" },
        { name: "Hospital Profile", path: "/hospital/profile" },
        { name: "Manage Appointments", path: "/hospital/appointments" },
      ],
    },
    {
      title: "Clinic Management",
      icon: <FaHospital className="text-purple-500" />,
      items: [
        { name: "Clinic Registration", path: "/clinicregistration" },
        { name: "Clinic Login", path: "/cliniclogin" },
        { name: "Clinic Dashboard", path: "/clinic/dashboard" },
        { name: "Add Doctor", path: "/clinic/add-doctor" },
        { name: "All Doctors", path: "/clinic/all-doctors" },
        { name: "Clinic Profile", path: "/clinic/profile" },
        { name: "Clinic Appointments", path: "/clinic/appointments" },
      ],
    },
    {
      title: "Consultant Portal",
      icon: <FaUserMd className="text-red-500" />,
      items: [
        { name: "Consultant Registration", path: "/consultantregistration" },
        { name: "Consultant Login", path: "/consultantlogin" },
        { name: "Consultant Dashboard", path: "/consultant/dashboard" },
        { name: "My Appointments", path: "/consultant/appointments" },
        { name: "Profile Settings", path: "/consultant/profile" },
      ],
    },
    {
      title: "Search Features",
      icon: <FaSearch className="text-yellow-500" />,
      items: [
        { name: "Search by Specialty", path: "/specialty-results" },
        { name: "Find Doctors", path: "/doctor-results" },
        { name: "Find Hospitals", path: "/hospital-results" },
        { name: "Find Clinics", path: "/clinic-results" },
        { name: "Doctor Profiles", path: "/doctor/profile" },
      ],
    },
    {
      title: "Additional Resources",
      icon: <FaQuestionCircle className="text-indigo-500" />,
      items: [
        { name: "About Us", path: "/about" },
        { name: "Help Center", path: "/help" },
        { name: "Reviews", path: "/reviews" },
        { name: "Navigation Guide", path: "/nav-help" },
      ],
    },
  ];

  const quickInfo = {
    title: "How to Use Medico Platform",
    steps: [
      "1. Register/Login based on your role (User/Hospital/Clinic/Consultant)",
      "2. Complete your profile information",
      "3. Users can search for healthcare services",
      "4. Book appointments with doctors or clinics",
      "5. Manage appointments and view medical records",
      "6. Leave reviews and feedback for services",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Medico
          </h1>
          <p className="text-lg text-gray-600">
            Your Complete Healthcare Management Platform
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{quickInfo.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickInfo.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Navigation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold ml-2">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-blue-600 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-2 group-hover:bg-blue-500 transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
