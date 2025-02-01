import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaHeart, FaArrowRight, FaUserMd, FaHospital,
  FaAmbulance, FaPills, FaCalendarCheck
} from 'react-icons/fa';

const UserFooter = () => {
  const quickLinks = [
    { name: "Find a Doctor", icon: <FaUserMd />, path: "/find-doctor" },
    { name: "Book Appointment", icon: <FaCalendarCheck />, path: "/appointment" },
    { name: "Emergency Care", icon: <FaAmbulance />, path: "/emergency" },
    { name: "Our Hospitals", icon: <FaHospital />, path: "/hospitals" },
    { name: "Online Pharmacy", icon: <FaPills />, path: "/pharmacy" }
  ];

  const services = [
    "Primary Care", "Specialty Care", "Emergency Services",
    "Mental Health", "Dental Care", "Pediatrics",
    "Laboratory Services", "Radiology"
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="opacity-90">Stay updated with the latest medical news, health tips, and special offers.</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white 
                    placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold
                    hover:shadow-lg transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
                bg-clip-text text-transparent">Medico</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Providing quality healthcare services with a commitment to excellence and compassion.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                    text-white flex items-center justify-center hover:shadow-lg transition-shadow"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Our Services</h3>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <motion.div
                  key={service}
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaArrowRight className="mr-2 text-sm" />
                  <span>{service}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Contact Us</h3>
            <div className="space-y-4">
              {[
                { icon: <FaPhoneAlt />, text: "+1 (555) 123-4567", label: "Emergency Helpline:" },
                { icon: <FaEnvelope />, text: "contact@medico.com", label: "Email:" },
                { icon: <FaMapMarkerAlt />, text: "123 Healthcare Ave, Medical District, NY 10001", label: "Location:" },
                { icon: <FaClock />, text: "24/7 Emergency Services", label: "Hours:" }
              ].map((item) => (
                <div key={item.label} className="flex items-start">
                  <span className="text-blue-600 mt-1 mr-3">{item.icon}</span>
                  <div>
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} Medico. All rights reserved. Made with{' '}
              <FaHeart className="inline text-red-500 mx-1" /> for better healthcare
            </p>
            <div className="flex gap-6 text-gray-600">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-blue-600 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;