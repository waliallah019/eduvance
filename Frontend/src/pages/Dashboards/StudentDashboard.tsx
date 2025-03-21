import { useState } from "react";
import { FaBook, FaClipboardCheck, FaChalkboardTeacher, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import CurrentCourses from "../StudentFunctionalities/CurrentCourses";
import StudentResults from "../StudentFunctionalities/Result";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaClipboardCheck />, key: "dashboard" },
    { name: "My Courses", icon: <FaBook />, key: "courses" },
    { name: "My Results", icon: <FaClipboardCheck />, key: "results" },
    { name: "My Attendance", icon: <FaClipboardCheck />, key: "attendance" },
    { name: "My Teachers", icon: <FaChalkboardTeacher />, key: "teachers" },
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
        <h2 className="text-4xl font-semibold mb-6">Student Dashboard</h2>
        {activeSection === "dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Total Courses</h3>
              <p className="text-3xl font-bold text-yellow-400">5</p>
            </div>
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Attendance Rate</h3>
              <p className="text-3xl font-bold text-yellow-400">92%</p>
            </div>
          </div>
        )}
        {activeSection !== "dashboard" && activeSection !== "courses" && activeSection != "results" && (
          <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{menuItems.find((item) => item.key === activeSection)?.name}</h3>
            <p className="text-gray-400 mt-2">Feature under development...</p>
          </div>
        )}
        {activeSection === "courses" && <CurrentCourses />}
        {activeSection === "results" && <StudentResults />}
      </main>
    </div>
  );
};

export default StudentDashboard;
