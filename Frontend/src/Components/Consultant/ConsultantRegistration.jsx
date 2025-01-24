import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcaseMedical,
  FaRupeeSign,
  FaInfoCircle,
  FaLock,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import Select from 'react-select';

const INDIA_STATES_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
};

const SPECIALTIES = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'general-medicine', label: 'General Medicine' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'obstetrics-gynecology', label: 'Obstetrics & Gynecology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'pulmonology', label: 'Pulmonology' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'urology', label: 'Urology' }
];

function ConsultantRegistration() {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    doctorName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    address: "",
    experience: "",
    specialities: [],
    consultationFees: "",
    description: "",
    photo: null,
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
  });

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.doctorName) newErrors.doctorName = "Doctor name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Mobile number is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.address) newErrors.address = "Address is required";
    } else if (step === 2) {
      if (!selectedLocation) newErrors.location = "Please pick a location";
    } else if (step === 3) {
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.specialities.length) {
        newErrors.specialities = "Please select at least one speciality";
      }
      if (!formData.consultationFees)
        newErrors.consultationFees = "Consultation fees required";
      if (!formData.description)
        newErrors.description = "Description is required";
    } else if (step === 4) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "state") {
      setCities(INDIA_STATES_CITIES[value] || []);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    toast.loading("Fetching location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(loc);
          setFormData((prev) => ({
            ...prev,
            latitude: loc.lat,
            longitude: loc.lng,
          }));
          toast.dismiss();
          toast.success("Location fetched!");
        },
        () => {
          toast.dismiss();
          toast.error("Unable to fetch location");
        }
      );
    } else {
      toast.dismiss();
      toast.error("Geolocation not supported");
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("Final Form Data:", formData);
      toast.success("Consultant registered successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: step === num ? 1.1 : 1,
                    backgroundColor: step >= num ? "#2563eb" : "#fff",
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold
                    ${
                      step >= num
                        ? "text-white shadow-lg shadow-blue-200"
                        : "text-gray-400 border-2 border-gray-200"
                    } transition-all duration-300`}
                >
                  {num}
                </motion.div>
                <span className="mt-3 text-sm font-medium text-gray-600">
                  {num === 1 && "Basic Info"}
                  {num === 2 && "Location"}
                  {num === 3 && "Details"}
                  {num === 4 && "Security"}
                </span>
              </div>
            ))}
            <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 -z-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Consultant Registration
          </h2>

          <AnimatePresence mode="wait">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    icon={<FaUserMd />}
                    label="Doctor Name"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    error={errors.doctorName}
                    required
                  />
                  <InputField
                    icon={<FaEnvelope />}
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <InputField
                    icon={<FaPhone />}
                    label="Mobile Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    required
                  />
                  <div className="md:col-span-2">
                    <SelectField
                      icon={<FaMapMarkerAlt />}
                      label="State"
                      name="state"
                      options={Object.keys(INDIA_STATES_CITIES)}
                      value={formData.state}
                      onChange={handleInputChange}
                      error={errors.state}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <SelectField
                      icon={<FaMapMarkerAlt />}
                      label="City"
                      name="city"
                      options={cities}
                      value={formData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      disabled={!formData.state}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      icon={<FaMapMarkerAlt />}
                      label="Address"
                      name="address"
                      as="textarea"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={errors.address}
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaMapMarkerAlt />
                      <span>Use Current Location</span>
                    </button>
                  </div>
                  <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-gray-200">
                    <MapContainer
                      center={selectedLocation || { lat: 20.5937, lng: 78.9629 }}
                      zoom={selectedLocation ? 13 : 5}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {selectedLocation && (
                        <Marker position={selectedLocation}>
                          <Popup>
                            <div className="text-center">
                              <b>Selected Location</b>
                              <br />
                              Lat: {selectedLocation.lat.toFixed(4)}
                              <br />
                              Lng: {selectedLocation.lng.toFixed(4)}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    icon={<FaBriefcaseMedical />}
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleInputChange}
                    error={errors.experience}
                    required
                  />
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaUserMd className="mr-2 text-blue-500" />
                        <label>Specialities</label>
                      </div>
                      <Select
                        isMulti
                        name="specialities"
                        options={SPECIALTIES}
                        value={formData.specialities}
                        onChange={(selected) => {
                          setFormData(prev => ({
                            ...prev,
                            specialities: selected
                          }));
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select specialities..."
                        styles={{
                          control: (base) => ({
                            ...base,
                            padding: '2px',
                            borderRadius: '0.5rem',
                            borderColor: errors.specialities ? '#EF4444' : '#D1D5DB',
                            '&:hover': {
                              borderColor: '#3B82F6'
                            }
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#EBF5FF',
                            borderRadius: '0.375rem'
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#2563EB'
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#2563EB',
                            ':hover': {
                              backgroundColor: '#DBEAFE',
                              color: '#1E40AF'
                            }
                          })
                        }}
                      />
                      {errors.specialities && (
                        <p className="text-red-500 text-sm mt-1">{errors.specialities}</p>
                      )}
                    </div>
                  </div>
                  <InputField
                    icon={<FaRupeeSign />}
                    label="Consultation Fees"
                    name="consultationFees"
                    type="number"
                    value={formData.consultationFees}
                    onChange={handleInputChange}
                    error={errors.consultationFees}
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      icon={<FaInfoCircle />}
                      label="Description"
                      name="description"
                      as="textarea"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      error={errors.description}
                      placeholder="Describe your expertise and services..."
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaImage className="mr-2 text-blue-500" />
                        <label>Photo</label>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData((prev) => ({ ...prev, photo: null }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="consultant-photo"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="consultant-photo"
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                            >
                              Upload Photo
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <InputField
                    icon={<FaLock />}
                    label="Set Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    required
                  />
                  <InputField
                    icon={<FaLock />}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              )}

              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="group px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl 
                      hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: -3 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        repeatType: "reverse",
                      }}
                    >
                      ←
                    </motion.span>
                    <span>Previous Step</span>
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                      text-white rounded-xl hover:from-blue-700 hover:to-blue-800 
                      transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: 3 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        repeatType: "reverse",
                      }}
                    >
                      →
                    </motion.span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 
                      text-white rounded-xl hover:from-green-700 hover:to-green-800 
                      transition-all transform hover:scale-105 shadow-lg"
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

const InputField = ({ icon, label, error, ...props }) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      <label>{label}</label>
    </div>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ icon, label, options, error, ...props }) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      <label>{label}</label>
    </div>
    <select
      {...props}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default ConsultantRegistration;