import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './Pages/landingPage'
import DoctorPage from './Pages/DoctorRegPage'
import HospitalRegistration from './Components/Hospital/HospitalRegistration'
import ClinicRegistration from './Components/Clinic/ClinicRegistration'
import ConsultantRegistration from './Components/Consultant/ConsultantRegistration'
import ConsultantLogin from './Components/Consultant/Consultantlogin'
import ClinicLogin from './Components/Clinic/ClinicLogin'
import HospitalLogin from './Components/Hospital/Hospitallogin'
import HospitalNavbar from './Components/Navbar/HospitalNav'
import HospitalDashboard from './Components/Hospital/Mainpage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/doctorpage" element={<DoctorPage />} />
        <Route path="/hospitalregistration" element={<HospitalRegistration />} />
        <Route path="/clinicregistration" element={<ClinicRegistration />} />
        <Route path="/consultantregistration" element={<ConsultantRegistration />} />
        <Route path="/consultantlogin" element={<ConsultantLogin />} />
        <Route path="/cliniclogin" element={<ClinicLogin />} />
        <Route path="/hospitallogin" element={<HospitalLogin />} />
        <Route path="/hospitalnav" element={<HospitalNavbar />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App