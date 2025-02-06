import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStethoscope,
  FaStar,
  FaCalendarAlt,
  FaHospital,
  FaCheck,
  FaVideo,
  FaHeart,
  FaBrain,
  FaTooth,
  FaEye,
  FaAmbulance,
  FaQuoteRight,
  FaUserMd,
  FaClinicMedical,
  FaChevronDown,
  FaLocationArrow,
  FaPencilAlt,
  FaTimes,
  FaLungs,
  FaSyringe,
  FaBaby,
  FaMicroscope,
  FaWeight,
  FaHeadSideCough,
  FaFirstAid,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaCapsules,
  FaHeartbeat,
} from "react-icons/fa";
import UserNav from "../Navbar/UserNav";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const HealthcareSearch = () => {
  const [count, setCount] = useState({ doctors: 0, patients: 0, hospitals: 0 });
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("doctor");
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [clinicSearch, setClinicSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState("");
  const navigate = useNavigate();
  const reviewSectionRef = useRef(null);

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
    console.log("Search initiated:", {
      searchType,
      currentSearchValue: getCurrentSearchValue(),
    });
    toast.dismiss();

    function getCurrentSearchValue() {
      switch (searchType) {
        case "doctor":
          return doctorSearch;
        case "hospital":
          return hospitalSearch;
        case "clinic":
          return clinicSearch;
        default:
          return "";
      }
    }

    const currentSearchValue = getCurrentSearchValue();

    // Validate input
    if (searchType === "specialty" && !selectedSpecialty) {
      console.log("Validation failed: No specialty selected");
      toast.error("Please select a specialty");
      return;
    }

    if (searchType !== "specialty" && !currentSearchValue.trim()) {
      console.log("Validation failed: No search term entered");
      toast.error(`Please enter ${searchType} name`);
      return;
    }

    setIsLoading(true);
    console.log("Setting loading state: true");
    toast.loading("Searching...");

    try {
      let endpoint = "";
      let params = new URLSearchParams();

      // Build endpoint and params
      console.log("Building search parameters:", {
        searchType,
        currentSearchValue,
      });

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

      console.log(
        "Fetching from:",
        `http://localhost:8000${endpoint}?${params}`
      );

      const response = await fetch(
        `http://localhost:8000${endpoint}?${params}`
      );
      const data = await response.json();

      console.log("Search response:", data);

      if (data.success) {
        // Navigate based on search type
        switch (searchType) {
          case "doctor":
            navigate("/doctorresults", {
              state: {
                results: data.results,
                searchTerm: currentSearchValue,
              },
            });
            break;
          case "hospital":
            navigate("/hospitalresults", {
              state: {
                results: data.results,
                searchTerm: currentSearchValue,
              },
            });
            break;
          case "clinic":
            navigate("/clinicresults", {
              state: {
                results: data.results,
                searchTerm: currentSearchValue,
              },
            });
            break;
          case "specialty":
            navigate("/specialtyresults", {
              state: {
                results: data.results,
                specialty: selectedSpecialty,
              },
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
      console.log("Setting loading state: false");
      setIsLoading(false);
      toast.dismiss();
    }
  }, [
    searchType,
    doctorSearch,
    hospitalSearch,
    clinicSearch,
    selectedSpecialty,
    userLocation,
    navigate,
  ]);

  // Memoize search types to prevent re-renders
  const searchTypes = useMemo(
    () => [
      {
        id: "specialty",
        label: "Search by Specialty",
        icon: <FaStethoscope />,
      },
      { id: "doctor", label: "Find a Doctor", icon: <FaUserMd /> },
      { id: "hospital", label: "Find Hospital", icon: <FaHospital /> },
      { id: "clinic", label: "Find Clinic", icon: <FaClinicMedical /> },
    ],
    []
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 500),
    [handleSearch]
  );

  // Handle search type change with logging
  const handleSearchTypeChange = useCallback((type) => {
    console.log("Changing search type:", type);
    setSearchType(type);
    setSelectedSpecialty(null);
    setSearchResults([]);
    setDoctorSearch("");
    setHospitalSearch("");
    setClinicSearch("");
  }, []);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Get email from localStorage if exists
    const userEmail = localStorage.getItem('userEmail') || 'guest@guest.com';
    const userType = localStorage.getItem('userEmail') ? 'User' : 'Guest';
  
    try {
      const response = await axios.post('http://localhost:8000/api/webreviews/create', {
        email: userEmail,
        userType,
        rating,
        review
      });
  
      if (response.data.success) {
        toast.success('Thank you for your feedback!');
        setRating(0);
        setReview('');
        setShowReviewModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setShowReviewForm(true);
  };

  return (
    <div className="relative min-h-screen">
      <UserNav />
      <div className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-gray-300/80" />

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
              {searchTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSearchTypeChange(type.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300
                    ${
                      searchType === type.id
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
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
                    {searchType === "specialty" ? (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)
                          }
                          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
                                    bg-white text-gray-800 flex items-center justify-between
                                    hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        >
                          <span className="flex items-center text-gray-700">
                            {selectedSpecialty
                              ? specialtyOptions.find(
                                  (opt) => opt.value === selectedSpecialty
                                )?.label
                              : "Select Specialty"}
                          </span>
                          <FaChevronDown
                            className={`text-gray-400 transition-transform duration-200 
                            ${
                              isSpecialtyDropdownOpen
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {isSpecialtyDropdownOpen && (
                          <div
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                                        rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          >
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
                                <span className="mr-2 text-blue-600">
                                  {specialty.icon}
                                </span>
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
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
                                   bg-white text-gray-800 placeholder-gray-500
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   shadow-sm transition duration-200"
                      />
                    )}
                  </div>
                </div>

                {/* <div className="flex-1 min-w-[200px]"></div>
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
                </div> */}

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={debouncedSearch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 
             hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <FaSearch />
                        Search
                      </>
                    )}
                  </button>

                  {/* New Near Me button - only show for doctor/hospital/clinic */}
                  {/* {searchType !== 'specialty' && (
                    <button
                      onClick={handleNearMeSearch}
                      disabled={isLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 
                                 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      {isLoading ? "Searching Nearby..." : "Find Near Me"}

                    </button>
                    
                  )} */}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {specialties.map((specialty) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={specialty.name}
                  onClick={() => setSelectedSpecialty(specialty.name)}
                  className={`flex items-center px-6 py-3 rounded-full 
                    ${
                      selectedSpecialty === specialty.name
                        ? "bg-white text-blue-600"
                        : "bg-white/20 text-white"
                    } transition-all duration-300`}
                >
                  <span className="mr-2">{specialty.icon}</span>
                  {specialty.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.a
          href="tel:102"
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-36 right-8 bg-red-600 text-white p-4 rounded-full 
           shadow-lg flex items-center gap-2 z-50 hover:bg-red-700
           transition-all duration-300 group animate-bounce hover:animate-none"
          aria-label="Call Emergency Ambulance"
        >
          <FaAmbulance className="text-2xl" />
          <span className="hidden group-hover:inline whitespace-nowrap font-semibold">
            Call: 102
          </span>
        </motion.a>
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

      {/* Floating Review Button */}
      <motion.button
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.7)",
            "0 0 0 10px rgba(59, 130, 246, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="fixed bottom-16 right-8 z-[9998] bg-blue-600 text-white px-6 py-3 
                  rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300
                  flex items-center gap-2 cursor-pointer transform hover:scale-105"
        onClick={() => setShowReviewModal(true)}
      >
        <FaPencilAlt className="h-5 w-5" />
        <span className="hidden md:inline">Write a Review</span>
      </motion.button>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] 
                      flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Rating Section */}
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Your Review</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full h-32 px-4 py-2 border rounded-lg resize-none"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg 
                            hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    features: ["Blood Test", "ECG", "Physical Examination"],
  },
  {
    title: "Advanced Health Checkup",
    price: "$199",
    features: ["Blood Test", "ECG", "MRI", "Consultation"],
  },
  {
    title: "Premium Health Checkup",
    price: "$299",
    features: ["Blood Test", "ECG", "MRI", "Consultation", "Full Body Scan"],
  },
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
