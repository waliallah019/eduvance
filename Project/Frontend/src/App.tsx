import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import TeacherDashboard from "./pages/Dashboards/TeacherDashboard";
import FinanceDashboard from "./pages/Dashboards/FinanceManagerDashboard";
import OwnerDashboard from "./pages/Dashboards/OwnerDashboard";
import RequireAuth from "./components/authentication/RequireAuth";
// import Unauthorized from "./pages/Unauthorized"; // Add this page for unauthorized users

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Role-Based Access */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth allowedRoles={["admin", "super-admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/finance-manager-dashboard"
          element={
            <RequireAuth allowedRoles={["finance_manager"]}>
              <FinanceDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <StudentDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/owner-dashboard"
          element={
            <RequireAuth allowedRoles={["owner"]}>
              <OwnerDashboard />
            </RequireAuth>
          }
        />

        {/* Catch-All for Undefined Routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
