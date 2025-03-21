import { useState } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, FaBook, FaSchool,FaChartLine, FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AttendanceTracking from "../AdminFunctionalities/AttendanceTracking"; // Import the separate component
import ManageStudents from "../AdminFunctionalities/ManageStudents"; // Import
import ManageStaff from "../AdminFunctionalities/ManageStaff"; // Import
import ManageCourses from "../AdminFunctionalities/ManageCourse";
import { ResultTracking } from "../AdminFunctionalities/ResultTracking";
import  ManageClass  from "../AdminFunctionalities/ManageClass";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, key: "dashboard" },
    { name: "Manage Students", icon: <FaUserGraduate />, key: "manage_students" },
    { name: "Manage Staff", icon: <FaChalkboardTeacher />, key: "manage_staff" },
    { name: "Attendance Tracking", icon: <FaClipboardCheck />, key: "attendance" },
    { name: "Result Tracking", icon: <FaBook />, key: "results" },
    { name: "Course Management", icon: <FaBook />, key: "courses" },
    {name : "Class Management" , icon : <FaSchool /> , key: "classes"},
    
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
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all ${
                  activeSection === item.key ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
                }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <Link to="/login">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all">
            <FaSignOutAlt /> Logout
          </button>
        </Link>
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
          {activeSection === "manage_staff" && <ManageStaff />}
          {activeSection === "courses" && <ManageCourses />}
          {activeSection === "results" && <ResultTracking />}
          {activeSection === "classes" && <ManageClass />}

        
      </main>
    </div>
  );
};

export default AdminDashboard;
