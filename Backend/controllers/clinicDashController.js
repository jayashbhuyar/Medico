const Appointment = require("../models/Appointments");

const getClinicDashboard = async (req, res) => {
    try {
        const { email } = req.params;

        // Get date ranges for calculations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        // Get today's appointments
        const todayPatients = await Appointment.countDocuments({
            clinicEmail: email,
            appointmentDate: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // Get total appointments
        const appointments = await Appointment.countDocuments({
            clinicEmail: email
        });

        // Get completed appointments for revenue and patient count
        const completedAppointments = await Appointment.find({
            clinicEmail: email,
            status: "completed"
        });

        // Calculate revenue
        const revenue = completedAppointments.reduce(
            (total, apt) => total + (apt.fees || 0), 0
        );

        // Get unique patients
        const uniquePatients = await Appointment.distinct("patientEmail", {
            clinicEmail: email
        });

        // Get weekly stats
        const weeklyAppointments = await getWeeklyStats(email);

        // Get patient distribution
        const patientDistribution = await getPatientTypes(email);

        res.status(200).json({
            success: true,
            data: {
                todayPatients,
                appointments,
                totalPatients: uniquePatients.length,
                revenue,
                weeklyAppointments,
                patientDistribution
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
};

// Helper function for weekly statistics
const getWeeklyStats = async (email) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = await Appointment.aggregate([
        {
            $match: {
                clinicEmail: email,
                appointmentDate: { $gte: oneWeekAgo }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: '$appointmentDate' },
                count: { $sum: 1 }
            }
        }
    ]);

    return days.map((day, index) => ({
        name: day,
        count: stats.find(s => s._id === index + 1)?.count || 0
    }));
};

// Helper function for patient type distribution
const getPatientTypes = async (email) => {
    const stats = await Appointment.aggregate([
        {
            $match: { clinicEmail: email }
        },
        {
            $group: {
                _id: '$patientType',
                value: { $sum: 1 }
            }
        }
    ]);

    const colors = {
        new: "#10B981",
        regular: "#3B82F6",
        followup: "#F59E0B"
    };

    return stats.map(type => ({
        name: type._id || 'New',
        value: type.value,
        color: colors[type._id?.toLowerCase()] || colors.new
    }));
};

module.exports = {
    getClinicDashboard
};