import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import StudentDashboard from './pages/Dashboards/StudentDashboard';
import TeacherDashboard from './pages/Dashboards/TeacherDashboard';
import FinanceDashboard from './pages/Dashboards/FinanceManagerDashboard';
import OwnerDashboard from './pages/Dashboards/OwnerDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="//finance-manager-dashboard" element={<FinanceDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
