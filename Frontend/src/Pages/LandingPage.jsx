import { Link } from "react-router-dom";
import TranslateWidget from "../Components/Translate/TranslateWidget";

const Landingpage = () => {
    
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
          <TranslateWidget />
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
              Welcome to <span className="text-blue-600">Health</span>Connect
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-stretch">
              {/* Doctor Card */}
              <Link 
                to="/doctorpage"
                className="w-full md:w-1/2 max-w-sm transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full transform -rotate-6"></div>
                    <img 
                      src="https://img.freepik.com/premium-photo/3d-doctor-cartoon-character-health-care-background_962764-87947.jpg"
                      alt="Doctor Profile" 
                      className="relative w-64 h-64 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                  </div>
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-blue-600">Doctor Portal</h2>
                    <p className="text-gray-600">Access your medical practice, manage patients, and schedule appointments</p>
                    <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                      Enter as Doctor
                    </div>
                  </div>
                </div>
              </Link>
    
              {/* Patient Card */}
              <Link 
                to="/patientre"
                className="w-full md:w-1/2 max-w-sm transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full transform rotate-6"></div>
                    <img 
                      src="https://img.freepik.com/premium-vector/user-interface-icon-cartoon-style-illustration_161751-2838.jpg"
                      alt="Patient Profile" 
                      className="relative w-64 h-64 mx-auto rounded-full object-cover border-4 border-green-500 shadow-lg"
                    />
                  </div>
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-green-600">Patient Portal</h2>
                    <p className="text-gray-600">View your medical records, book appointments, and connect with doctors</p>
                    <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">
                      Enter as Patient
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      );
    };
    
  export default Landingpage;