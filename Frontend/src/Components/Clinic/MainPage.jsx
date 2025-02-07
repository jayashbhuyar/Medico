import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserMd, FaCalendarCheck, FaChartLine, 
  FaUserInjured, FaClock, FaCheckCircle,
  FaClinicMedical, FaPrescription, FaUserNurse
} from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
// import HospitalNavbar from '../Navbar/ClinicNav';
import ClinicNav from '../Navbar/ClinicNav';

const appointmentData = [
  { name: 'Mon', count: 24 },
  { name: 'Tue', count: 18 },
  { name: 'Wed', count: 22 },
  { name: 'Thu', count: 26 },
  { name: 'Fri', count: 30 },
  { name: 'Sat', count: 15 },
  { name: 'Sun', count: 10 }
];

const patientStats = [
  { name: 'New', value: 45, color: '#10B981' },
  { name: 'Regular', value: 35, color: '#3B82F6' },
  { name: 'Follow-up', value: 20, color: '#F59E0B' }
];
// const clinicData=JSON.parse(localStorage.getItem('clinicData'));
function ClinicDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClinicNav />
      
      <div className="p-6">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, Doctor</h1>
          <p className="text-gray-600">Here's your clinic overview for today</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={<FaUserInjured className="text-blue-500"/>}
            title="Today's Patients"
            value="42"
            trend="+12%"
          />
          <StatsCard 
            icon={<FaCalendarCheck className="text-green-500"/>}
            title="Appointments"
            value="28"
            trend="+5%"
          />
          <StatsCard 
            icon={<FaPrescription className="text-purple-500"/>}
            title="Prescriptions"
            value="35"
            trend="+8%"
          />
          <StatsCard 
            icon={<FaUserNurse className="text-red-500"/>}
            title="Staff Present"
            value="12"
            trend="100%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Weekly Appointments</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#93C5FD" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Patient Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            icon={<FaCalendarCheck className="text-2xl"/>}
            title="Schedule Appointment"
            description="Create a new appointment"
          />
          <QuickAction
            icon={<FaUserMd className="text-2xl"/>}
            title="Add Patient"
            description="Register new patient"
          />
          <QuickAction
            icon={<FaPrescription className="text-2xl"/>}
            title="Write Prescription"
            description="Create new prescription"
          />
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({ icon, title, value, trend }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow-sm"
  >
    <div className="flex justify-between items-center">
      <div>
        {icon}
        <h3 className="text-gray-600 mt-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <span className="text-green-500 text-sm">{trend}</span>
    </div>
  </motion.div>
);

const QuickAction = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow-sm cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default ClinicDashboard;