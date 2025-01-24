import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserMd, FaCalendarCheck, FaChartLine, 
  FaUserInjured, FaClock, FaCheckCircle 
} from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import HospitalNavbar from '../Navbar/HospitalNav';

const data = [
  { name: 'Mon', appointments: 4 },
  { name: 'Tue', appointments: 3 },
  { name: 'Wed', appointments: 2 },
  { name: 'Thu', appointments: 6 },
  { name: 'Fri', appointments: 8 },
  { name: 'Sat', appointments: 9 },
  { name: 'Sun', appointments: 3 }
];

const pieData = [
  { name: 'Completed', value: 400, color: '#10B981' },
  { name: 'Pending', value: 300, color: '#F59E0B' },
  { name: 'Cancelled', value: 100, color: '#EF4444' }
];

function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HospitalNavbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Doctors"
            value="24"
            icon={<FaUserMd />}
            color="blue"
          />
          <StatsCard 
            title="Today's Appointments"
            value="12"
            icon={<FaCalendarCheck />}
            color="green"
          />
          <StatsCard 
            title="Total Patients"
            value="1,248"
            icon={<FaUserInjured />}
            color="purple"
          />
          <StatsCard 
            title="Revenue"
            value="₹45,678"
            icon={<FaChartLine />}
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Appointments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#6366F1" 
                  fill="#818CF8" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Appointment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      New appointment scheduled
                    </p>
                    <p className="text-sm text-gray-500">
                      Dr. Smith with Patient #12345
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-gray-500">2 min ago</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Add New Doctor
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Schedule Appointment
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-6 rounded-xl shadow-lg border-b-4 border-${color}-500`}
  >
    <div className="flex items-center">
      <div className={`flex-shrink-0 h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <span className={`text-${color}-600 text-2xl`}>{icon}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default HospitalDashboard;