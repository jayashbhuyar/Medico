import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHospital,
  FaUserMd,
  FaUser,
  FaSearch,
  FaQuestionCircle,
  FaHome,
  FaArrowRight,
  FaStethoscope,
  FaHeartbeat,
  FaAmbulance,
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
        { name: "Dashboard", path: "/hospitallogin" },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserNav />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Medico Platform Map
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {platformOverview.description}
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {platformOverview.features.map((feature, index) => (
              <motion.span
                key={index}
                variants={itemVariants}
                className="px-6 py-3 bg-white rounded-full shadow-md text-gray-700 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
              >
                <FaHeartbeat className="inline mr-2 text-blue-500" />
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Grid */}
      <motion.div
        className="max-w-7xl mx-auto px-4 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {navigationTree.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.li key={itemIndex} whileHover={{ x: 5 }}>
                    <Link
                      to={item.path}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group transition-all duration-300"
                    >
                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                        {item.name}
                      </span>
                      {item.badge ? (
                        <span className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      ) : (
                        <FaArrowRight className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SiteMap;
