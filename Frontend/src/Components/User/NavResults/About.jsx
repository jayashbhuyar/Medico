import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHospital, FaUserMd, FaUsers, FaAward, 
  FaBullseye, FaHandHoldingMedical, FaHeartbeat 
} from 'react-icons/fa';

const About = () => {
  const stats = [
    { number: "1000+", label: "Doctors", icon: <FaUserMd /> },
    { number: "500+", label: "Hospitals", icon: <FaHospital /> },
    { number: "50000+", label: "Patients Served", icon: <FaUsers /> },
    { number: "4.8/5", label: "User Rating", icon: <FaAward /> }
  ];

  const values = [
    {
      icon: <FaHandHoldingMedical />,
      title: "Patient First",
      description: "We prioritize patient care and well-being above all"
    },
    {
      icon: <FaBullseye />,
      title: "Quality Healthcare",
      description: "Ensuring access to quality healthcare services"
    },
    {
      icon: <FaHeartbeat />,
      title: "Innovation",
      description: "Leveraging technology for better healthcare"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About Medico
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming healthcare delivery through technology and innovation. 
            We connect patients with the best healthcare providers for quality care.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div className="text-blue-500 text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
          <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
            To make quality healthcare accessible to everyone through technology 
            and innovation. We strive to create a seamless connection between 
            patients and healthcare providers.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div className="text-blue-500 text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-blue-600 text-white rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-6">Have questions? We're here to help!</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
                           hover:bg-blue-50 transition duration-300">
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;