import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaStethoscope, FaHospital, 
  FaUserMd, FaClinicMedical, FaChevronDown, 
  FaHeart, FaBrain, FaTooth, FaEye, FaLungs 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const UserMainPage = () => {
  const [searchType, setSearchType] = useState('doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const searchTypes = [
    { id: 'specialty', label: 'Search by Specialty', icon: <FaStethoscope /> },
    { id: 'doctor', label: 'Find Doctor', icon: <FaUserMd /> },
    { id: 'hospital', label: 'Find Hospital', icon: <FaHospital /> },
    { id: 'clinic', label: 'Find Clinic', icon: <FaClinicMedical /> }
  ];

  const specialties = [
    { id: 'cardiology', name: 'Cardiology', icon: <FaHeart /> },
    { id: 'neurology', name: 'Neurology', icon: <FaBrain /> },
    { id: 'dental', name: 'Dental Care', icon: <FaTooth /> },
    { id: 'eye', name: 'Eye Care', icon: <FaEye /> },
    { id: 'pulmonology', name: 'Pulmonology', icon: <FaLungs /> }
  ];

  const handleSearch = () => {
    if (searchType === 'specialty' && !selectedSpecialty) {
      toast.error('Please select a specialty');
      return;
    }
    
    if (searchType !== 'specialty' && !searchQuery.trim()) {
      toast.error(`Please enter ${searchType} name`);
      return;
    }

    navigate(`/search/${searchType}`, {
      state: { query: searchQuery, specialty: selectedSpecialty }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute w-32 h-32 bg-white rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen px-4 py-12 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white space-y-12"
          >
            {/* Hero Section */}
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl sm:text-6xl md:text-7xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Your Health Journey
                </span>
                <motion.span 
                  className="block mt-2 text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Starts Here
                </motion.span>
              </motion.h1>
              <p className="text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto">
                Connect with top healthcare professionals and facilities in your area
              </p>
            </div>

            {/* Search Types */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
              {searchTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchType(type.id)}
                  className={`
                    flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl
                    backdrop-blur-md border transition-all duration-300
                    ${searchType === type.id 
                      ? "bg-white/20 border-white/30 shadow-lg shadow-white/10" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"}
                  `}
                >
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{type.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{type.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Search Container */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 
                        shadow-2xl border border-white/20 max-w-4xl mx-auto
                        hover:bg-white/15 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  {searchType === 'specialty' ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                        className="w-full px-6 py-4 rounded-xl bg-white/90 
                                 text-gray-800 flex items-center justify-between
                                 hover:bg-white transition-all duration-300
                                 focus:ring-2 focus:ring-blue-400"
                      >
                        <span>
                          {selectedSpecialty 
                            ? specialties.find(s => s.id === selectedSpecialty)?.name 
                            : 'Select Specialty'}
                        </span>
                        <FaChevronDown className={`transition-transform duration-300 
                          ${isSpecialtyDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>

                      <AnimatePresence>
                        {isSpecialtyDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 py-2 bg-white/95 
                                     backdrop-blur-md rounded-xl shadow-xl"
                          >
                            {specialties.map((specialty) => (
                              <motion.button
                                key={specialty.id}
                                whileHover={{ x: 4 }}
                                onClick={() => {
                                  setSelectedSpecialty(specialty.id);
                                  setIsSpecialtyDropdownOpen(false);
                                }}
                                className="w-full px-6 py-3 flex items-center gap-3 
                                         hover:bg-blue-50 transition-colors"
                              >
                                <span className="text-xl text-blue-600">
                                  {specialty.icon}
                                </span>
                                <span>{specialty.name}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="relative">
                      <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 
                                         text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${searchType}s...`}
                        className="w-full pl-14 pr-6 py-4 rounded-xl bg-white/90 
                                 text-gray-800 placeholder-gray-500 
                                 focus:ring-2 focus:ring-blue-400 
                                 transition-all duration-300"
                      />
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
                           text-white rounded-xl flex items-center justify-center gap-2 
                           hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 
                           md:w-auto w-full"
                >
                  <FaSearch className="text-xl" />
                  <span className="font-medium">Search</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default UserMainPage;