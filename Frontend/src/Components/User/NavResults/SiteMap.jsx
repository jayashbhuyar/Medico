import React from "react";
import { Link } from "react-router-dom";
import {
  FaHospital,
  FaUserMd,
  FaUser,
  FaSearch,
  FaQuestionCircle,
  FaHome,
} from "react-icons/fa";
import UserNav from "../../Navbar/UserNav";

const SiteMap = () => {
  const platformOverview = {
    title: "Medico Platform Overview",
    description:
      "A comprehensive healthcare management system connecting patients, hospitals, clinics, and consultants.",
    features: [
      "Centralized Healthcare Management",
      "Easy Appointment Booking",
      "Real-time Doctor Search",
      "Digital Medical Records",
      "Review & Rating System",
    ],
  };

  const navigationTree = [
    {
      title: "Main Portal",
      icon: <FaHome className="text-blue-600" />,
      description: "Start your healthcare journey",
      items: [
        { name: "Landing Page", path: "/", badge: "Start Here" },
        { name: "Healthcare Search", path: "/patientpage", badge: "Popular" },
        { name: "Doctor Registration", path: "/doctorpage" },
        { name: "Reviews", path: "/reviewpage" },
      ],
    },
    {
      title: "Patient Services",
      icon: <FaUser className="text-green-600" />,
      description: "Access healthcare services",
      items: [
        { name: "User Login", path: "/userlogin", badge: "Required" },
        { name: "User Dashboard", path: "/patientpage" },
        { name: "My Appointments", path: "/user/appointments" },
        { name: "My Profile", path: "/userprofile" },
        { name: "Search Doctors", path: "/patientpage" },
      ],
    },
    {
      title: "Hospital Hub",
      icon: <FaHospital className="text-red-600" />,
      description: "Hospital management portal",
      items: [
        { name: "Hospital Registration", path: "/hospitalregistration" },
        { name: "Hospital Login", path: "/hospitallogin" },
        { name: "Dashboard", path: "/hospital/dashboard" },
        { name: "Manage Doctors", path: "/hospital/alldoctors" },
        { name: "Add Doctor", path: "/hospital/adddoctor" },
        { name: "Hospital Profile", path: "/hospital/profile" },
        { name: "Appointments", path: "/hospital/appointments" },
      ],
    },
    {
      title: "Clinic Center",
      icon: <FaHospital className="text-purple-600" />,
      description: "Clinic management system",
      items: [
        { name: "Clinic Registration", path: "/clinicregistration" },
        { name: "Clinic Login", path: "/cliniclogin" },
        { name: "Dashboard", path: "/clinic/dashboard" },
        { name: "Add Doctor", path: "/clinicadddoctor" },
        { name: "All Doctors", path: "/clinicalldoctors" },
        { name: "Profile", path: "/clinicprofile" },
        { name: "Appointments", path: "/clinic/appointments" },
      ],
    },
    {
      title: "Consultant Portal",
      icon: <FaUserMd className="text-yellow-600" />,
      description: "For medical consultants",
      items: [
        { name: "Registration", path: "/consultantregistration" },
        { name: "Login", path: "/consultantlogin" },
        { name: "Dashboard", path: "/consultant/dashboard" },
        { name: "Appointments", path: "/consultant/appointments" },
        { name: "Profile", path: "/consultantprofile" },
      ],
    },
    {
      title: "Search & Discovery",
      icon: <FaSearch className="text-indigo-600" />,
      description: "Find healthcare services",
      items: [
        { name: "Specialty Search", path: "/specialtyresults" },
        { name: "Find Doctors", path: "/doctorresults" },
        { name: "Find Hospitals", path: "/hospitalresults" },
        { name: "Find Clinics", path: "/clinicresults" },
      ],
    },
    {
      title: "Help & Support",
      icon: <FaQuestionCircle className="text-teal-600" />,
      description: "Get assistance",
      items: [
        { name: "About Us", path: "/usernavabout" },
        { name: "Help Center", path: "/usernavhelp" },
        { name: "Navigation Guide", path: "/sitemap" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <UserNav />
      <div className="max-w-7xl mx-auto mt-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Medico Platform Map
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {platformOverview.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {platformOverview.features.map((feature, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {navigationTree.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">{section.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group transition-colors"
                    >
                      <span className="text-gray-600 group-hover:text-blue-600">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
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
