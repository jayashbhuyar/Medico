import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaHospital,
  FaClinicMedical,
  FaClock,
  FaRupeeSign,
  FaFilter,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { toast } from "react-toastify";

import DoctorProfile from "./DoctorProfile";

const NavDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/v2/doctors/all"
      );
      setDoctors(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch doctors");
      setLoading(false);
      toast.error("Failed to load doctors");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (doctorLat, doctorLng) => {
    if (!userLocation || !doctorLat || !doctorLng) return null;

    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(doctorLat);
    const lon2 = parseFloat(doctorLng);

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const sortedDoctors = [...doctors]
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          if (!userLocation) return 0;
          return (
            calculateDistance(a.latitude, a.longitude) -
            calculateDistance(b.latitude, b.longitude)
          );
        case "fees":
          return a.consultationFees - b.consultationFees;
        case "experience":
          return b.experience - a.experience;
        default:
          return 0;
      }
    })
    .filter((doctor) => {
      if (selectedDay) {
        return doctor.availability.includes(selectedDay);
      }
      return true;
    });

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfile(true);
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSortBy("distance");
          toast.success("Location updated successfully");
        },
        (error) => {
          toast.error("Please enable location services");
        }
      );
    }
  };

  const handleBooking = () => {
    toast.info("Please login to book an appointment");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Filters & Sort Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <option value="">Sort By</option>
              <option value="experience">Experience</option>
              <option value="fees">Consultation Fees</option>
              <option value="distance">Distance</option>
            </select>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <option value="">Available Days</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNearMe}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-all w-full md:w-auto"
          >
            <FaMapMarkerAlt />
            <span>Near Me</span>
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              distance={calculateDistance(doctor.latitude, doctor.longitude)}
              onViewProfile={() => {
                setSelectedDoctor(doctor);
                setShowProfile(true);
              }}
              onBooking={handleBooking}
            />
          ))}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {showProfile && selectedDoctor && (
        <DoctorProfile
          doctor={selectedDoctor}
          distance={calculateDistance(
            selectedDoctor.latitude,
            selectedDoctor.longitude
          )}
          onClose={() => {
            setShowProfile(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

// Update DoctorCard component with enhanced styling
const DoctorCard = ({ doctor, distance, onViewProfile, onBooking }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                 transition-all duration-300 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUserMd className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {doctor.degrees.join(", ")}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {doctor.organizationType === "Hospital" ? (
              <FaHospital className="text-blue-600" />
            ) : (
              <FaClinicMedical className="text-green-600" />
            )}
            <span>{doctor.organizationName}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>
              {doctor.city}, {doctor.state}
            </span>
            {distance && (
              <span className="text-blue-600 font-medium">({distance} km)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-gray-400" />
            <span>₹{doctor.consultationFees} Consultation Fee</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-gray-400" />
            <span>
              {doctor.timeSlots.start} - {doctor.timeSlots.end}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onBooking}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg 
                     hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Book Appointment
          </button>
          <button
            onClick={onViewProfile}
            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 
                   rounded-lg hover:bg-blue-50 transition duration-300"
          >
            View Profile
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaMapMarkerAlt />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NavDoctors;