import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserMd,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMoneyBill,
  FaCalendarAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import HospitalNavbar from '../Navbar/HospitalNav';

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <div className="mt-2">{children}</div>
  </div>
);

const InfoRow = ({ icon, text, label }) => (
  <div className="flex items-center text-gray-600">
    {icon}
    <span className="ml-2 text-sm">
      {label && <strong>{label}: </strong>}
      {text}
    </span>
  </div>
);

const DoctorDetailModal = ({ doctor, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/64?text=Dr";
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <FaUserMd className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-gray-600 text-sm">{doctor.degrees.join(", ")}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>

      <div className="space-y-4 text-sm text-gray-600">
        <Section title="Contact Information">
          <InfoRow icon={<FaEnvelope />} text={doctor.email} />
          <InfoRow icon={<FaPhone />} text={doctor.phone} />
          {doctor.alternatePhone && (
            <InfoRow
              icon={<FaPhone />}
              text={doctor.alternatePhone}
              label="Alternate"
            />
          )}
        </Section>

        <Section title="Professional Details">
          <div className="flex flex-wrap gap-2">
            {doctor.degrees.map((degree, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {degree}
              </span>
            ))}
          </div>
          <InfoRow
            icon={<FaUserMd />}
            text={`${doctor.experience} years experience`}
          />
        </Section>

        <Section title="Availability">
          <InfoRow
            icon={<FaClock />}
            text={`${doctor.timeSlots.start} - ${doctor.timeSlots.end}`}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.availableDays.map((day, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {day}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Consultation">
          <InfoRow
            icon={<FaMoneyBill />}
            text={`₹${doctor.consultationFees}`}
            label="Consultation Fee"
          />
        </Section>
      </div>
    </motion.div>
  </motion.div>
);

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const deleteDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const response = await fetch(
          `https://medico-care-theta.vercel.app/api/doctors/delete/${doctorId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success) {
          toast.success("Doctor deleted successfully");
          // Update the doctors list
          setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
        } else {
          toast.error(data.message || "Failed to delete doctor");
        }
      } catch (error) {
        // console.error("Error deleting doctor:", error);
        toast.error("Something went wrong while deleting the doctor");
      }
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
        const response = await fetch(
          `https://medico-care-theta.vercel.app/api/doctors/organization/${hospitalData.id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        setDoctors(data.doctors);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <>
      <HospitalNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <>
      <HospitalNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500">Error: {error}</div>
      </div>
      </>
    );
  }

  return (
    <>
      <HospitalNavbar />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Medical Professionals
        </h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Doctor",
                    "Contact",
                    "Specialties",
                    "Timings",
                    "Fees",
                    "Actions",
                  ].map((header) => (
                    <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <motion.tr
                  key={doctor._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          {doctor.profileImage ? (
                            <img
                            src={doctor.profileImage}
                              alt={doctor.name}
                              className="h-10 w-10 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/40?text=Dr";
                                }}
                                />
                          ) : (
                            <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                              <FaUserMd className="text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.degrees.join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {doctor.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {doctor.specialties.map((specialty, index) => (
                          <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {doctor.timeSlots.start} - {doctor.timeSlots.end}
                      </div>
                      <div className="text-xs text-gray-500">
                        {doctor.availableDays.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{doctor.consultationFees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
                          >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => deleteDoctor(doctor._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-2"
                          >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedDoctor && (
          <DoctorDetailModal
            doctor={selectedDoctor}
            onClose={() => {
              setShowModal(false);
              setSelectedDoctor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
            </>
  );
};

export default AllDoctors;