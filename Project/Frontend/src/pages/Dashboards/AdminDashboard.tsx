import { useState, useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool, FaClipboardCheck, FaBook, FaChartLine, FaKey, FaLock } from "react-icons/fa";
import AttendanceTracking from "../AdminFunctionalities/AttendanceTracking";
import ManageStudents from "../AdminFunctionalities/ManageStudents";
import ManageStaff from "../AdminFunctionalities/ManageStaff";
import ManageCourses from "../AdminFunctionalities/ManageCourse";
import { ResultTracking } from "../AdminFunctionalities/ResultTracking";
import LogoutButton from "../../components/ui/LogoutButton";
import ResetPassword from "../AdminFunctionalities/ResetPassword";
import ManageClass from "../AdminFunctionalities/ManageClass";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "admin";
    setRole(storedRole);
  }, []);

  // Define menu items and their access levels
  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, key: "dashboard", restricted: false },
    { name: "Manage Students", icon: <FaUserGraduate />, key: "manage_students", restricted: false },
    { name: "Manage Staff", icon: <FaChalkboardTeacher />, key: "manage_staff", restricted: role !== "super-admin" },
    { name: "Attendance Tracking", icon: <FaClipboardCheck />, key: "attendance", restricted: false },
    { name: "Result Tracking", icon: <FaBook />, key: "results", restricted: false },
    { name: "Course Management", icon: <FaBook />, key: "courses", restricted: false },
    {name : "Class Management" , icon : <FaSchool /> , key: "classes"},
    { name: "Reset Password", icon: <FaKey />, key: "reset_password", restricted: false }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a40] to-[#110020] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#29293d] p-6 min-h-screen shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-center mb-5">
            edu<span className="text-yellow-400">vance</span>
          </h1>
          <nav>
            {menuItems.map((item) => (
              <div key={item.key} className="relative group">
                <button
                  onClick={() => !item.restricted && setActiveSection(item.key)}
                  className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all ${
                    activeSection === item.key && !item.restricted
                      ? "bg-yellow-400 text-black"
                      : item.restricted
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700"
                  }`}
                  disabled={item.restricted}
                >
                  {item.icon} {item.name} {item.restricted && <FaLock className="ml-auto text-red-500" />}
                </button>
                {item.restricted && (
                  <span className="absolute left-full ml-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Access restricted for {role}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-semibold mb-6">Admin Dashboard</h2>

        {activeSection === "dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-yellow-400">1,230</p>
            </div>
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Total Staff</h3>
              <p className="text-3xl font-bold text-yellow-400">145</p>
            </div>
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Pending Fees</h3>
              <p className="text-3xl font-bold text-yellow-400">$12,500</p>
            </div>
          </div>
        )}

        {activeSection === "attendance" && <AttendanceTracking />}
        {activeSection === "manage_students" && <ManageStudents />}
        {activeSection === "courses" && <ManageCourses />}
        {activeSection === "results" && <ResultTracking />}
        {activeSection === "reset_password" && <ResetPassword />}
        {role === "super-admin" && activeSection === "manage_staff" && <ManageStaff />}
        {activeSection === "classes" && <ManageClass />}


      </main>
    </div>
  );
};

export default AdminDashboard;
