import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EarlyWarning from './pages/EarlyWarning';
import LearningHub from './pages/LearningHub';
import FinancialSupport from './pages/FinancialSupport';
import ParentPortal from './pages/ParentPortal';
import SchoolingManagement from './pages/Schooling';
import OnlineConsultation from './pages/OnlineFreeConsultation';
import ResourceLibrary from './pages/ResourceLibrary';
import VirtualTutoring from './pages/VirtualTutoring';
import CommunityForums from './pages/CommunityForums';
import BookingConfirmation from './pages/BookingConfirmation';
import Scholarships from './Financial Support/Scholarships';
import Grants from './Financial Support/Grants';
import Loans from './Financial Support/Loans';
import FAQ from './Financial Support/FAQ';
import ParentingResources from './Parent\'s Corner/ParentingResources';
import CommunicationTips from './Parent\'s Corner/CommunicationTips';
import UpcomingEvents from './Parent\'s Corner/UpcomingEvents';
import ParentingFAQs from './Parent\'s Corner/ParentingFaq';
import './index.css';
import Footer from "./components/Footer";
import About from "./pages/About";
import ChatBox from "./chatbot/ChatBot";
import CalendarView from "./Schooling/CalendarView";
import ProgressPage from "./Schooling/ProgressPage";
import CombinedPage from "./Schooling/CombinedCourse";
import Admin from "./adminDashboard/Admin";
import RewardSystem from "./components/RewardSystem";
import Store from "./components/Store";
import ExpertDashboard from "./components/ExpertDashboard";
import TutorDashboard from "./components/TutorDashboard";
import ParentDashboard from "./components/ParentDashboard";
import QRScanner from "./components/QRScanner";
import LoginSignupModal from "./components/SignUpLogin";
import StudentGrievanceForm from "./components/GravienceForm";
import CommunityPage from "./components/CommunityPage";
import ProtectedRoute from "./ProtctRoute";
import StudentAdminDashboard from "./adminDashboard/studentdetails/StudentAdminDash";
import CoolegeWiseDropout from "./adminDashboard/admin/SchoolWiseDropout";
import Contact from './pages/Contact';
import DropoutAnalytics from './pages/DropoutAnalytics';
import StudentMonitoring from './pages/StudentMonitoring';
import HeadmasterDashboard from "./pages/HeadmasterDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import StudentPortal from "./components/StudentPortal";
import { Toaster } from 'react-hot-toast';
import AdminDashboard from "./components/AdminDashboard";
import { useAuth } from "./context/AuthContext";


function App() {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null;
  return (
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="overflow-hidden"><Navbar /></div>
        <div className="overflow-hidden"><Navbar /></div>
        <div className="mt-16 bg-gray-50 overflow-auto min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About /> } />
            <Route path="/contact" element={<Contact role="Contact Us" />} />
            <Route path="/signin" element={<LoginSignupModal />} />
            <Route path="/signup" element={<LoginSignupModal />} />

            {/* --- Teacher & Admin Monitoring Routes --- */}
            <Route path="/early-warning" element={<ProtectedRoute><EarlyWarning /></ProtectedRoute>} />
            <Route path="/dropout-analytics" element={<ProtectedRoute><DropoutAnalytics /></ProtectedRoute>} />
            <Route path="/student-monitoring" element={<ProtectedRoute><StudentMonitoring /></ProtectedRoute>} />

            {/* --- Learning Hub Section --- */}
            <Route path="/learning-hub" element={<ProtectedRoute><LearningHub /></ProtectedRoute>}/>
            <Route path='/learning-hub/online-consultation' element={<ProtectedRoute><OnlineConsultation /></ProtectedRoute>} />
            <Route path='/learning-hub/resource-library' element={<ProtectedRoute><ResourceLibrary /></ProtectedRoute>} />
            <Route path='/learning-hub/virtual-tutoring' element={<ProtectedRoute><VirtualTutoring /></ProtectedRoute>} />
            <Route path='/learning-hub/community-forums' element={<ProtectedRoute><CommunityForums /></ProtectedRoute>} />
            <Route path='/learning-hub/community-forums/:forumName' element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
            <Route path='/learning-hub/virtual-tutoring/booking' element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

            {/* --- Financial Support Section --- */}
            <Route path="/financial-support" element={<ProtectedRoute><FinancialSupport /></ProtectedRoute>} />
            <Route path='/financial-support/scholarships' element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
            <Route path='/financial-support/grants' element={<ProtectedRoute><Grants /></ProtectedRoute>} />
            <Route path='/financial-support/loans' element={<ProtectedRoute><Loans /></ProtectedRoute>} />
            <Route path='/financial-support/faq' element={<ProtectedRoute><FAQ /></ProtectedRoute>} />

            {/* --- Parental Engagement Section --- */}
            <Route path="/parental-engagement" element={<ProtectedRoute><ParentPortal /></ProtectedRoute>} />
            <Route path="/parental-engagement/resources" element={<ProtectedRoute><ParentingResources /></ProtectedRoute>} />
            <Route path="/parental-engagement/communication" element={<ProtectedRoute><CommunicationTips /></ProtectedRoute>} />
            <Route path="/parental-engagement/events" element={<ProtectedRoute><UpcomingEvents /></ProtectedRoute>} />
            <Route path="/parental-engagement/faq" element={<ProtectedRoute><ParentingFAQs /></ProtectedRoute>} />

            {/* --- Schooling & Progress Section --- */}
            <Route path="/flexible-schooling" element={<ProtectedRoute><SchoolingManagement /></ProtectedRoute>} />
            <Route path="/schooling/courses" element={<ProtectedRoute><CombinedPage /></ProtectedRoute>} />
            <Route path="/schooling/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/schooling/studentSchedule" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />

            {/* --- Role-Based Dashboards (Hyphenated for consistency) --- */}
            <Route path="/student-dashboard" element={<ProtectedRoute role="student"><StudentPortal /></ProtectedRoute>} />
            <Route path="/teacher-dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/headmaster-dashboard" element={<ProtectedRoute role="headmaster"><HeadmasterDashboard /></ProtectedRoute>} />
            <Route path="/district_official-dashboard" element={<ProtectedRoute role="district_official"><DistrictDashboard /></ProtectedRoute>} />
            <Route path="/expert-dashboard" element={<ProtectedRoute role="expert"><ExpertDashboard /></ProtectedRoute>} />
            <Route path="/tutor-dashboard" element={<ProtectedRoute role="tutor"><TutorDashboard /></ProtectedRoute>} />
            <Route path="/parent-dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<Admin />} />


            {/* --- Miscellaneous Features --- */}
            <Route path="/reward" element={<ProtectedRoute><RewardSystem /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Store /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
            <Route path="/complaint" element={<ProtectedRoute><StudentGrievanceForm /></ProtectedRoute>} />
            <Route path="/subadmin/student-details" element={<StudentAdminDashboard />} />
            <Route path="/admin/school-dropout" element={<CoolegeWiseDropout />} />


            {/* --- Legacy/Redirects --- */}
            <Route path="/student/dashboard" element={<Navigate to="/student-dashboard" />} />
            <Route path="/teacher/dashboard" element={<Navigate to="/teacher-dashboard" />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />



            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin/*" element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />}/>
          </Routes>
          <ChatBox />
        </div>
        <Footer />
      </Router>
  );
}

export default App;