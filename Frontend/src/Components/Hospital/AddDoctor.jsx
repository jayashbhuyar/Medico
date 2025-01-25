import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaGraduationCap, FaClock, FaKey } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AddDoctor = () => {
  // Get hospital data from localStorage
  const hospitalData = JSON.parse(localStorage.getItem('hospitalData'));

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Hospital data from localStorage
    hospitalId: hospitalData.id,
    hospitalName: hospitalData.hospitalName,
    hospitalEmail: hospitalData.email,
    state: hospitalData.state,
    city: hospitalData.city,
    address: hospitalData.address,
    
    // User input data
    name: '',
    email: '',
    degrees: [],
    experience: '',
    specialties: [],
    consultationFees: '',
    availableDays: [],
    timeSlots: {
      start: '',
      end: ''
    },
    userId: '',
    password: '',
    confirmPassword: ''
  });

  const degrees = [
    'MBBS', 'MD', 'MS', 'DNB', 'DM', 'MCh', 'BDS', 'MDS',
    'BHMS', 'BAMS', 'BUMS', 'DHMS', 'PhD'
  ];

  const specialties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Gynecology', 'Dermatology', 'ENT', 'Ophthalmology',
    'Psychiatry', 'Dental', 'General Medicine'
  ];

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  const handleDaySelect = (e) => {
    const day = e.target.value;
    setFormData(prev => ({
      ...prev,
      availableDays: e.target.checked 
        ? [...prev.availableDays, day]
        : prev.availableDays.filter(d => d !== day)
    }));
  };

  const handleTimeChange = (e, timeType) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [timeType]: e.target.value
      }
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    switch(currentStep) {
      case 1:
        if (!formData.name) errors.push("Doctor's name is required");
        if (!formData.email) errors.push("Doctor's email is required");
        break;
      case 2:
        if (formData.degrees.length === 0) errors.push("Select at least one degree");
        if (formData.specialties.length === 0) errors.push("Select at least one specialty");
        if (!formData.experience) errors.push("Experience is required");
        if (!formData.consultationFees) errors.push("Consultation fees is required");
        break;
      case 3:
        if (formData.availableDays.length === 0) errors.push("Select available days");
        if (!formData.timeSlots.start || !formData.timeSlots.end) errors.push("Time slots are required");
        break;
      case 4:
        if (!formData.userId) errors.push("User ID is required");
        if (!formData.password) errors.push("Password is required");
        if (formData.password !== formData.confirmPassword) errors.push("Passwords don't match");
        break;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(curr => curr + 1);
      return;
    }

    try {
      const response = await fetch('/api/hospital/add-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Doctor added successfully!');
        // Redirect or reset form
      } else {
        toast.error(data.message || 'Failed to add doctor');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  const FormSteps = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <motion.div
          key={step}
          className={`flex items-center ${step !== 4 ? 'w-32' : ''}`}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'} text-white`}
          >
            {step === 1 && <FaUserMd />}
            {step === 2 && <FaGraduationCap />}
            {step === 3 && <FaClock />}
            {step === 4 && <FaKey />}
          </motion.div>
          {step !== 4 && (
            <div className={`h-1 w-full ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </motion.div>
      ))}
    </div>
  );

  const BasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Doctor's Name"
          className="input-field"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Doctor's Email"
          className="input-field"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
    </motion.div>
  );

  const EducationExperience = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <select
            multiple
            name="degrees"
            className="input-field h-32"
            value={formData.degrees}
            onChange={(e) => handleMultiSelect(e, 'degrees')}
          >
            {degrees.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
          <label className="text-sm text-gray-500">Hold Ctrl to select multiple degrees</label>
        </div>
        
        <div className="relative">
          <select
            multiple
            name="specialties"
            className="input-field h-32"
            value={formData.specialties}
            onChange={(e) => handleMultiSelect(e, 'specialties')}
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <label className="text-sm text-gray-500">Hold Ctrl to select multiple specialties</label>
        </div>
        
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          className="input-field"
          value={formData.experience}
          onChange={handleInputChange}
        />
        
        <input
          type="number"
          name="consultationFees"
          placeholder="Consultation Fees (₹)"
          className="input-field"
          value={formData.consultationFees}
          onChange={handleInputChange}
        />
      </div>
    </motion.div>
  );

  const Availability = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Available Days</label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={(e) => handleDaySelect(e)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time Slots</label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="start"
              className="input-field"
              value={formData.timeSlots.start}
              onChange={(e) => handleTimeChange(e, 'start')}
            />
            <input
              type="time"
              name="end"
              className="input-field"
              value={formData.timeSlots.end}
              onChange={(e) => handleTimeChange(e, 'end')}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AccountSetup = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="userId"
          placeholder="Set User ID"
          className="input-field"
          value={formData.userId}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Set Password"
          className="input-field"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="input-field"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Add New Doctor
          </h2>
          
          <FormSteps />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && <BasicInfo />}
            {currentStep === 2 && <EducationExperience />}
            {currentStep === 3 && <Availability />}
            {currentStep === 4 && <AccountSetup />}
            
            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(curr => curr - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(curr => curr + 1)}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;