import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './Pages/LandingPage'
import DoctorPage from './Pages/DoctorRegPage'
import HospitalRegistration from './Components/Hospital/HospitalRegistration'
import ClinicRegistration from './Components/Clinic/ClinicRegistration'
import ConsultantRegistration from './Components/Consultant/ConsultantRegistration'
import ConsultantLogin from './Components/Consultant/Consultantlogin'
import ClinicLogin from './Components/Clinic/ClinicLogin'
import HospitalLogin from './Components/Hospital/HospitalLogin'
import HospitalNavbar from './Components/Navbar/HospitalNav'
import HospitalDashboard from './Components/Hospital/Mainpage'
import ClinicDashboard from './Components/Clinic/MainPage'
import ClinicNav from './Components/Navbar/ClinicNav'
import HealthcareSearch from './Components/User/Mainpage'
import UserNav from './Components/Navbar/UserNav'
import AddDoctor from './Components/Hospital/AddDoctor'
import AllDoctors from './Components/Hospital/AllDoctor'
import SpecialtyResults from './Components/User/Results/SpecialityResult'
import DoctorResults from './Components/User/Results/DoctorResult'
import HospitalResults from './Components/User/Results/HospitalResult'
import ClinicResults from './Components/User/Results/ClinicResult'
import UserLogin from './Components/User/Login'
import Hospitals from './Components/User/NavResults/NavHospital'
import NavDoctors from './Components/User/NavResults/NavDoctors'
import DoctorProfile from './Components/User/NavResults/DoctorProfile'
import About from './Components/User/NavResults/About'
import Help from './Components/User/NavResults/Help'
import ClinicAddDoctor from './Components/Clinic/ClinicAddDoctor'
import ClinicAllDoctors from './Components/Clinic/ClinicAllDoctor'
import AddPatient from './Components/common/AddPatient'
import UserFooter from './Components/User/Footer'
import UserMainpage from './Components/User/UserMainpage'

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
        <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        <Route path="/clinicnav" element={<ClinicNav />} />
        <Route path="/patientpage" element={<HealthcareSearch />} />
        <Route path="/usernav" element={<UserNav />} />
        <Route path="/adddoctor" element={<AddDoctor />} />
        <Route path="/alldoctors" element={<AllDoctors />} />
        <Route path="/specialtyresults" element={<SpecialtyResults />} />
        <Route path="/doctorresults" element={<DoctorResults />} />
        <Route path="/hospitalresults" element={<HospitalResults />} />
        <Route path="/clinicresults" element={<ClinicResults />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/usernavhospitals" element={<Hospitals />} />
        <Route path="/usernavdoctors" element={<NavDoctors />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} />
        <Route path="/usernavabout" element={<About />} />
        <Route path="/usernavhelp" element={<Help />} />
        <Route path="/clinicadddoctor" element={<ClinicAddDoctor />} />
        <Route path="/clinicalldoctors" element={<ClinicAllDoctors />} />
        <Route path="/addpatient" element={<AddPatient />} />
        <Route path="/userfooter" element={<UserFooter />} />
        <Route path="/usermainpage" element={<UserMainpage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App