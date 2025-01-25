import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaMapMarkerAlt, FaStethoscope, FaStar, 
  FaCalendarAlt, FaHospital, FaCheck, FaVideo,
  FaHeart, FaBrain, FaTooth, FaEye,
  FaAmbulance, FaQuoteRight, FaUserMd, FaClinicMedical,
  FaChevronDown,
  FaLungs, FaSyringe, FaBaby, FaMicroscope, FaWeight, 
  FaHeadSideCough, FaFirstAid, FaHandHoldingHeart, FaShieldAlt, FaCapsules,FaHeartbeat
} from 'react-icons/fa';
import UserNav from '../Navbar/UserNav';

const HealthcareSearch = () => {
  const [count, setCount] = useState({ doctors: 0, patients: 0, hospitals: 0 });
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('doctor');
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);

  const searchTypes = [
    { id: 'specialty', label: 'Search by Specialty', icon: <FaStethoscope /> },
    { id: 'doctor', label: 'Find a Doctor', icon: <FaUserMd /> },
    { id: 'hospital', label: 'Find Hospital', icon: <FaHospital /> },
    { id: 'clinic', label: 'Find Clinic', icon: <FaClinicMedical /> }
  ];

  const handleUseMyLocation = async () => {
    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setLocation(data.display_name);
      }
    } catch (error) {
      alert('Unable to get your location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => ({
        doctors: prev.doctors < 500 ? prev.doctors + 5 : prev.doctors,
        patients: prev.patients < 10000 ? prev.patients + 100 : prev.patients,
        hospitals: prev.hospitals < 100 ? prev.hospitals + 1 : prev.hospitals
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const specialties = [
    { icon: <FaHeart />, name: 'Cardiology' },
    { icon: <FaBrain />, name: 'Neurology' },
    { icon: <FaTooth />, name: 'Dental' },
    { icon: <FaEye />, name: 'Eye Care' },
    { icon: <FaStethoscope />, name: 'General Medicine' },
    { icon: <FaLungs />, name: 'Pulmonology' },
    // { icon: <FaSyringe />, name: 'Vaccination' },
    // { icon: <FaUserMd />, name: 'Internal Medicine' },
    // { icon: <FaBaby />, name: 'Pediatrics' },
    // { icon: <FaAmbulance />, name: 'Emergency Medicine' },
    // { icon: <FaMicroscope />, name: 'Pathology' },
    // { icon: <FaWeight />, name: 'Obesity & Nutrition' },
    // { icon: <FaHeadSideCough />, name: 'ENT (Ear, Nose & Throat)' },
    // { icon: <FaFirstAid />, name: 'First Aid' },
    // { icon: <FaHandHoldingHeart />, name: 'Cardiothoracic Surgery' },
    // { icon: <FaShieldAlt />, name: 'Immunology' },
    // { icon: <FaCapsules />, name: 'Pharmacology' },
    // { icon: <FaTooth />, name: 'Orthodontics' },
    // { icon: <FaMicroscope />, name: 'Microbiology' },
    // { icon: <FaSyringe />, name: 'Anesthesiology' },
    // { icon: <FaBrain />, name: 'Psychiatry' },
    // { icon: <FaStethoscope />, name: 'Geriatrics' },
    // { icon: <FaUserMd />, name: 'Rheumatology' },
    // { icon: <FaAmbulance />, name: 'Trauma Care' },
    // { icon: <FaHeart />, name: 'Vascular Surgery' },
    // { icon: <FaEye />, name: 'Ophthalmology' },
    // { icon: <FaHandHoldingHeart />, name: 'Cardiac Surgery' },
    // { icon: <FaWeight />, name: 'Endocrinology' },
    // { icon: <FaMicroscope />, name: 'Genetics' },
    // { icon: <FaStethoscope />, name: 'Family Medicine' },
  ];
  

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology', icon: <FaHeart /> },
    { value: 'neurology', label: 'Neurology', icon: <FaBrain /> },
    { value: 'dental', label: 'Dental Care', icon: <FaTooth /> },
    { value: 'eye', label: 'Eye Care', icon: <FaEye /> },
    { value: 'ambulance', label: 'Emergency Services', icon: <FaAmbulance /> },
    { value: 'pediatrics', label: 'Pediatrics', icon: <FaBaby /> },
    { value: 'surgery', label: 'Surgery', icon: <FaSyringe /> },
    { value: 'oncology', label: 'Oncology', icon: <FaMicroscope /> },
    { value: 'orthopedics', label: 'Orthopedics', icon: <FaClinicMedical /> },
    { value: 'mentalHealth', label: 'Mental Health', icon: <FaBrain /> },
    { value: 'geriatrics', label: 'Geriatrics', icon: <FaUserMd /> },
    { value: 'internalMedicine', label: 'Internal Medicine', icon: <FaStethoscope /> },
    { value: 'obstetrics', label: 'Obstetrics', icon: <FaHeartbeat /> },
    { value: 'dermatology', label: 'Dermatology', icon: <FaShieldAlt /> },
    { value: 'radiology', label: 'Radiology', icon: <FaVideo /> },
    { value: 'pathology', label: 'Pathology', icon: <FaCheck /> },
    { value: 'rehabilitation', label: 'Rehabilitation', icon: <FaHandHoldingHeart /> },
  ];
  

  const healthTips = [
    {
      title: "Daily Exercise",
      description: "30 minutes of exercise daily can improve your health significantly",
      icon: "🏃‍♂️"
    },
    {
      title: "Healthy Diet",
      description: "Maintain a balanced diet rich in fruits and vegetables",
      icon: "🥗"
    },
    {
      title: "Adequate Sleep",
      description: "Get 7-8 hours of quality sleep every night",
      icon: "😴"
    }
  ];

  const testimonials = [
    {
      name: "John Smith",
      review: "Amazing service! Found the perfect doctor for my needs.",
      rating: 5,
      image: "https://via.placeholder.com/60"
    },
    {
      name: "Sarah Johnson",
      review: "Quick and easy appointment booking process.",
      rating: 5,
      image: "https://via.placeholder.com/60"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <UserNav/>
      <div className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
        >
          <source src="/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/80" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Healthcare Match
            </h1>
            
            <div className="flex flex-wrap justify-center mb-8 gap-2">
              {searchTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSearchType(type.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300
                    ${searchType === type.id 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <span className="mr-2">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    {searchType === 'specialty' ? (
                      <div className="relative">
                        <button
                          onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
                                    bg-white text-gray-800 flex items-center justify-between
                                    hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        >
                          <span className="flex items-center text-gray-700">
                            {selectedSpecialty ? 
                              specialtyOptions.find(opt => opt.value === selectedSpecialty)?.label 
                              : 'Select Specialty'}
                          </span>
                          <FaChevronDown className={`text-gray-400 transition-transform duration-200 
                            ${isSpecialtyDropdownOpen ? 'transform rotate-180' : ''}`} 
                          />
                        </button>
                        
                        {isSpecialtyDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                                        rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {specialtyOptions.map((specialty) => (
                              <button
                                key={specialty.value}
                                onClick={() => {
                                  setSelectedSpecialty(specialty.value);
                                  setIsSpecialtyDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left flex items-center 
                                          text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <span className="mr-2 text-blue-600">{specialty.icon}</span>
                                <span>{specialty.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder={`Search ${searchType}s...`}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
                                   bg-white text-gray-800 placeholder-gray-500
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   shadow-sm transition duration-200"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
                                 bg-white text-gray-800 placeholder-gray-500
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 shadow-sm transition duration-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                    transition duration-300 shadow-lg hover:shadow-xl
                                    flex items-center justify-center">
                    <FaSearch className="mr-2" />
                    Search
                  </button>
                  <button
                    onClick={handleUseMyLocation}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg transition duration-300 shadow-lg hover:shadow-xl
                               flex items-center justify-center
                               ${isLoading 
                                 ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                                 : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    {isLoading ? 'Getting Location...' : 'Use My Location'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {specialties.map(specialty => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={specialty.name}
                  onClick={() => setSelectedSpecialty(specialty.name)}
                  className={`flex items-center px-6 py-3 rounded-full 
                    ${selectedSpecialty === specialty.name 
                      ? 'bg-white text-blue-600' 
                      : 'bg-white/20 text-white'
                    } transition-all duration-300`}
                >
                  <span className="mr-2">{specialty.icon}</span>
                  {specialty.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 bg-red-500 text-white p-4 rounded-full 
                     shadow-lg flex items-center space-x-2 z-50"
        >
          <FaAmbulance className="text-2xl" />
          <span>Emergency</span>
        </motion.button>
      </div>

      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="stat-card"
            >
              <h3 className="text-4xl font-bold mb-2">{count.doctors}+</h3>
              <p>Qualified Doctors</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="stat-card"
            >
              <h3 className="text-4xl font-bold mb-2">{count.patients}+</h3>
              <p>Satisfied Patients</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="stat-card"
            >
              <h3 className="text-4xl font-bold mb-2">{count.hospitals}+</h3>
              <p>Hospitals</p>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Specialists</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((doctor) => (
            <motion.div
              key={doctor}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`https://via.placeholder.com/300x200?text=Doctor${doctor}`}
                  alt="Doctor"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full 
                                 text-sm flex items-center">
                    <FaVideo className="mr-1" />
                    Available
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Dr. John Doe</h3>
                <p className="text-gray-600 text-sm mb-2">Cardiologist</p>
                <div className="flex items-center text-yellow-400 mb-2">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="text-gray-300" />
                  <span className="text-gray-600 text-sm ml-2">(127 reviews)</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">Consultation Fee: $100</div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Daily Health Tips</h2>
          <div className="flex overflow-x-auto gap-6 pb-4">
            {healthTips.map((tip, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] flex-shrink-0"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            What Our Patients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 relative"
              >
                <FaQuoteRight className="absolute top-4 right-4 text-blue-100 text-4xl" />
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.review}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Health Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthPackages.map((pkg) => (
              <PackageCard key={pkg.title} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Patient Testimonials
          </h2>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 transition duration-300 transform hover:scale-105"
  >
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const healthPackages = [
  {
    title: "Basic Health Checkup",
    price: "$99",
    features: ["Blood Test", "ECG", "Physical Examination"]
  },
  {
    title: "Advanced Health Checkup",
    price: "$199",
    features: ["Blood Test", "ECG", "MRI", "Consultation"]
  },
  {
    title: "Premium Health Checkup",
    price: "$299",
    features: ["Blood Test", "ECG", "MRI", "Consultation", "Full Body Scan"]
  }
];

const PackageCard = ({ title, price, features }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 transition duration-300 transform hover:scale-105"
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-600 mb-4">{price}</p>
    <ul className="space-y-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-center text-gray-600">
          <FaCheck className="text-green-500 mr-2" /> {feature}
        </li>
      ))}
    </ul>
  </motion.div>
);

export default HealthcareSearch;
