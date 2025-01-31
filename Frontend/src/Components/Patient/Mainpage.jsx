import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaMapMarkerAlt, FaStethoscope, FaStar, 
  FaCalendarAlt, FaHospital, FaCheck, FaVideo,
  FaHeart, FaBrain, FaTooth, FaEye,
  FaAmbulance, FaQuoteRight, FaUserMd, FaClinicMedical,
  FaChevronDown, FaLocationArrow,
  FaLungs, FaSyringe, FaBaby, FaMicroscope, FaWeight, 
  FaHeadSideCough, FaFirstAid, FaHandHoldingHeart, FaShieldAlt, FaCapsules,FaHeartbeat
} from 'react-icons/fa';
import UserNav from '../Navbar/UserNav';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const HealthcareSearch = () => {
  const [count, setCount] = useState({ doctors: 0, patients: 0, hospitals: 0 });
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("doctor");
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [clinicSearch, setClinicSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("prompt");
  const [searchMode, setSearchMode] = useState('search'); // 'search' or 'nearme'
  const [userCoordinates, setUserCoordinates] = useState(null);
  const navigate = useNavigate();

  // Debounce search to prevent multiple re-renders
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Memoized search handler
  const handleSearch = useCallback(async () => {
    console.log('Search initiated:', { searchType, currentSearchValue: getCurrentSearchValue() });
    toast.dismiss();

    function getCurrentSearchValue() {
      switch (searchType) {
        case "doctor": return doctorSearch;
        case "hospital": return hospitalSearch;
        case "clinic": return clinicSearch;
        default: return "";
      }
    }

    const currentSearchValue = getCurrentSearchValue();

    // Validate input
    if (searchType === "specialty" && !selectedSpecialty) {
      console.log('Validation failed: No specialty selected');
      toast.error("Please select a specialty");
      return;
    }

    if (searchType !== "specialty" && !currentSearchValue.trim()) {
      console.log('Validation failed: No search term entered');
      toast.error(`Please enter ${searchType} name`);
      return;
    }

    setIsLoading(true);
    console.log('Setting loading state: true');
    toast.loading("Searching...");

    try {
      let endpoint = "";
      let params = new URLSearchParams();

      // Build endpoint and params
      console.log('Building search parameters:', { searchType, currentSearchValue });
      
      switch (searchType) {
        case "doctor":
          endpoint = "/api/search/doctors";
          params.append("query", currentSearchValue.trim());
          break;
        case "hospital":
          endpoint = "/api/search/hospitals";
          params.append("query", currentSearchValue.trim());
          break;
        case "clinic":
          endpoint = "/api/search/clinics";
          params.append("query", currentSearchValue.trim());
          break;
        case "specialty":
          endpoint = "/api/search/specialty";
          params.append("specialty", selectedSpecialty);
          break;
      }

      if (userLocation) {
        params.append("lat", userLocation.latitude);
        params.append("lng", userLocation.longitude);
      }

      console.log('Fetching from:', `http://localhost:8000${endpoint}?${params}`);
      
      const response = await fetch(`http://localhost:8000${endpoint}?${params}`);
      const data = await response.json();

      console.log('Search response:', data);

      if (data.success) {
        // Navigate based on search type
        switch (searchType) {
          case "doctor":
            navigate('/doctorresults', { 
              state: { 
                results: data.results,
                searchTerm: currentSearchValue 
              }
            });
            break;
          case "hospital":
            navigate('/hospitalresults', { 
              state: { 
                results: data.results,
                searchTerm: currentSearchValue 
              }
            });
            break;
          case "clinic":
            navigate('/clinicresults', { 
              state: { 
                results: data.results,
                searchTerm: currentSearchValue 
              }
            });
            break;
          case "specialty":
            navigate('/specialtyresults', { 
              state: { 
                results: data.results,
                specialty: selectedSpecialty 
              }
            });
            break;
        }
        
        toast.success(`Found ${data.results.length} results`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.message || "Search failed");
    } finally {
      console.log('Setting loading state: false');
      setIsLoading(false);
      toast.dismiss();
    }
  }, [searchType, doctorSearch, hospitalSearch, clinicSearch, selectedSpecialty, userLocation, navigate]);

  // Memoize search types to prevent re-renders
  const searchTypes = useMemo(() => [
    { id: "specialty", label: "Search by Specialty", icon: <FaStethoscope /> },
    { id: "doctor", label: "Find a Doctor", icon: <FaUserMd /> },
    { id: "hospital", label: "Find Hospital", icon: <FaHospital /> },
    { id: "clinic", label: "Find Clinic", icon: <FaClinicMedical /> },
  ], []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [handleSearch]
  );

  // Handle search type change with logging
  const handleSearchTypeChange = useCallback((type) => {
    console.log('Changing search type:', type);
    setSearchType(type);
    setSelectedSpecialty(null);
    setSearchResults([]);
    setDoctorSearch("");
    setHospitalSearch("");
    setClinicSearch("");
  }, []);

  const handleUseMyLocation = async () => {
    if ("geolocation" in navigator) {
      toast.loading("Getting your location...");
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        toast.dismiss();
        toast.success("Location updated successfully");
        setLocationPermission("granted");
      } catch (error) {
        toast.dismiss();
        console.error("Location error:", error);
        toast.error("Unable to get your location");
        setLocationPermission("denied");
      }
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleNearMeClick = async () => {
    try {
      const position = await getCurrentPosition();
      setUserCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setSearchMode('nearme');
    } catch (error) {
      toast.error("Could not get your location. Please enable location services.");
    }
  };

  const searchNearMe = async () => {
    if (!userCoordinates) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/${searchType}/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userCoordinates.latitude,
          longitude: userCoordinates.longitude,
          radius: 5 // 5km radius
        })
      });
      const data = await response.json();
      // Handle results...
    } catch (error) {
      toast.error("Failed to find nearby results");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new handler function
  const handleNearMeSearch = async () => {
    if (!navigator.geolocation) {
      toast.error("Location services not available");
      return;
    }
  
    setIsLoading(true);
    toast.loading("Finding nearby...");
  
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const { latitude, longitude } = position.coords;
  
      // API endpoints based on search type
      const endpoints = {
        doctor: "/api/search/doctors/nearby",
        hospital: "/api/search/hospitals/nearby",
        clinic: "/api/search/clinics/nearby"
      };
  
      const endpoint = endpoints[searchType];
      if (!endpoint) return;
  
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, radius: 10 })
      });
  
      const data = await response.json();
      if (data.success) {
        navigate(`/${searchType}results`, {
          state: {
            results: data.results,
            isNearMe: true,
            coordinates: { latitude, longitude }
          }
        });
      }
    } catch (error) {
      toast.error("Could not find nearby locations");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => ({
        doctors: prev.doctors < 500 ? prev.doctors + 5 : prev.doctors,
        patients: prev.patients < 10000 ? prev.patients + 100 : prev.patients,
        hospitals: prev.hospitals < 100 ? prev.hospitals + 1 : prev.hospitals,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const specialties = [
    { icon: <FaHeart />, name: "Cardiology" },
    { icon: <FaBrain />, name: "Neurology" },
    { icon: <FaTooth />, name: "Dental" },
    { icon: <FaEye />, name: "Eye Care" },
    { icon: <FaStethoscope />, name: "General Medicine" },
    { icon: <FaLungs />, name: "Pulmonology" },
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
    { value: "cardiology", label: "Cardiology", icon: <FaHeart /> },
    { value: "neurology", label: "Neurology", icon: <FaBrain /> },
    { value: "dental", label: "Dental Care", icon: <FaTooth /> },
    { value: "eye", label: "Eye Care", icon: <FaEye /> },
    { value: "ambulance", label: "Emergency Services", icon: <FaAmbulance /> },
    { value: "pediatrics", label: "Pediatrics", icon: <FaBaby /> },
    { value: "surgery", label: "Surgery", icon: <FaSyringe /> },
    { value: "oncology", label: "Oncology", icon: <FaMicroscope /> },
    { value: "orthopedics", label: "Orthopedics", icon: <FaClinicMedical /> },
    { value: "mentalHealth", label: "Mental Health", icon: <FaBrain /> },
    { value: "geriatrics", label: "Geriatrics", icon: <FaUserMd /> },
    {
      value: "internalMedicine",
      label: "Internal Medicine",
      icon: <FaStethoscope />,
    },
    { value: "obstetrics", label: "Obstetrics", icon: <FaHeartbeat /> },
    { value: "dermatology", label: "Dermatology", icon: <FaShieldAlt /> },
    { value: "radiology", label: "Radiology", icon: <FaVideo /> },
    { value: "pathology", label: "Pathology", icon: <FaCheck /> },
    {
      value: "rehabilitation",
      label: "Rehabilitation",
      icon: <FaHandHoldingHeart />,
    },
  ];

  const healthTips = [
    {
      title: "Daily Exercise",
      description:
        "30 minutes of exercise daily can improve your health significantly",
      icon: "🏃‍♂️",
    },
    {
      title: "Healthy Diet",
      description: "Maintain a balanced diet rich in fruits and vegetables",
      icon: "🥗",
    },
    {
      title: "Adequate Sleep",
      description: "Get 7-8 hours of quality sleep every night",
      icon: "😴",
    },
  ];

  const testimonials = [
    {
      name: "John Smith",
      review: "Amazing service! Found the perfect doctor for my needs.",
      rating: 5,
      image: "https://via.placeholder.com/60",
    },
    {
      name: "Sarah Johnson",
      review: "Quick and easy appointment booking process.",
      rating: 5,
      image: "https://via.placeholder.com/60",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <UserNav />
      
      {/* Hero Section */}
      <div className="relative min-h-[90vh]">
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="/medical-background.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-800/80" />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Your Perfect
              <span className="text-blue-300"> Healthcare </span>
              Match
            </h1>
            
            {/* Search Type Selection */}
            <div className="flex flex-wrap justify-center gap-4 p-4">
              {searchTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSearchTypeChange(type.id)}
                  className={`
                    flex items-center px-8 py-4 rounded-xl
                    transition-all duration-300 transform hover:-translate-y-1
                    ${searchType === type.id 
                      ? "bg-white text-blue-700 shadow-lg font-semibold"
                      : "bg-white/10 text-white hover:bg-white/20"}
                  `}
                >
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                    {searchType === "specialty" ? (
                      <div className="relative">
                        <button
                          onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                          className="w-full pl-12 pr-4 py-4 rounded-xl text-left
                                   bg-white/10 text-white border border-white/30
                                   hover:bg-white/20 transition-all"
                        >
                          {selectedSpecialty || "Select Specialty"}
                        </button>
                        
                        {isSpecialtyDropdownOpen && (
                          <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg 
                                        max-h-60 overflow-y-auto">
                            {specialtyOptions.map((specialty) => (
                              <button
                                key={specialty.value}
                                onClick={() => {
                                  setSelectedSpecialty(specialty.value);
                                  setIsSpecialtyDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left flex items-center
                                         text-gray-700 hover:bg-blue-50"
                              >
                                <span className="mr-3 text-blue-600">{specialty.icon}</span>
                                <span>{specialty.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={
                          searchType === "doctor"
                            ? doctorSearch
                            : searchType === "hospital"
                            ? hospitalSearch
                            : clinicSearch
                        }
                        onChange={(e) =>
                          searchType === "doctor"
                            ? setDoctorSearch(e.target.value)
                            : searchType === "hospital"
                            ? setHospitalSearch(e.target.value)
                            : setClinicSearch(e.target.value)
                        }
                        placeholder={`Search ${searchType}s...`}
                        className="w-full pl-12 pr-4 py-4 rounded-xl
                                 bg-white/10 text-white placeholder-white/60
                                 border border-white/30 hover:bg-white/20
                                 focus:ring-2 focus:ring-blue-400
                                 transition-all"
                      />
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500
                           text-white rounded-xl flex items-center justify-center gap-2
                           hover:from-blue-600 hover:to-indigo-600 transition-all
                           disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                    rounded-full animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      <FaSearch className="text-xl" />
                      <span className="font-medium">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing sections with updated styling */}
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Specialists
        </h2>
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
                  <span
                    className="bg-green-500 text-white px-3 py-1 rounded-full 
                                 text-sm flex items-center"
                  >
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
                  <span className="text-gray-600 text-sm ml-2">
                    (127 reviews)
                  </span>
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  Consultation Fee: $100
                </div>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Daily Health Tips
          </h2>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Health Packages
          </h2>
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
      <Toaster position="top-right" />
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
