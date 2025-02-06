import React from 'react';
import { motion } from 'framer-motion';
import {
    FaUserTie, FaCalendarCheck, FaChartLine,
    FaUserFriends, FaClock
} from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import ConsultantNavbar from '../Navbar/ConsultantNav';

const data = [
    { name: 'Mon', consultations: 5 },
    { name: 'Tue', consultations: 3 },
    { name: 'Wed', consultations: 6 },
    { name: 'Thu', consultations: 4 },
    { name: 'Fri', consultations: 8 },
    { name: 'Sat', consultations: 7 },
    { name: 'Sun', consultations: 2 }
];

const pieData = [
    { name: 'Completed', value: 350, color: '#10B981' },
    { name: 'Scheduled', value: 280, color: '#F59E0B' },
    { name: 'Cancelled', value: 90, color: '#EF4444' }
];

function ConsultantDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <ConsultantNavbar />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Consultations"
                        value="320"
                        icon={<FaUserTie />}
                        color="blue"
                    />
                    <StatsCard
                        title="Upcoming Consultations"
                        value="14"
                        icon={<FaCalendarCheck />}
                        color="green"
                    />
                    <StatsCard
                        title="Total Clients"
                        value="850"
                        icon={<FaUserFriends />}
                        color="purple"
                    />
                    <StatsCard
                        title="Earnings"
                        value="₹75,250"
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
                        <h3 className="text-lg font-semibold mb-4">Weekly Consultations</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="consultations"
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
                        <h3 className="text-lg font-semibold mb-4">Consultation Status</h3>
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

                {/* Recent Activity & Quick Actions */}
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
                                            New consultation booked
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Client #100{item}
                                        </p>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-500">5 min ago</span>
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
                            <button className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                                Add New Client
                            </button>
                            <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                                Schedule Consultation
                            </button>
                            <button className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md">
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
            <div className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
                <span className={`text-${color}-600 text-2xl`}>{icon}</span>
            </div>
            <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </motion.div>
);

export default ConsultantDashboard;
