import { useState } from "react";
import { FaClipboardCheck, FaBook, FaUserGraduate} from "react-icons/fa";
import LogoutButton from "../../components/ui/LogoutButton";
import AttendanceTracking from "../TeacherFunctionalities/AttendanceTracking";
import ManageStudents from "../TeacherFunctionalities/ManageStudents";
import AssignedCourses from "../TeacherFunctionalities/AssignedCourses";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaClipboardCheck />, key: "dashboard" },
    { name: "Assigned Courses", icon: <FaBook />, key: "courses" },
    { name: "Mark Attendance", icon: <FaClipboardCheck />, key: "attendance" },
    { name: "Manage Students", icon: <FaUserGraduate />, key: "students" },
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
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-semibold mb-6">Teacher Dashboard</h2>
        {activeSection === "dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Assigned Courses</h3>
              <p className="text-3xl font-bold text-yellow-400">3</p>
            </div>
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Students Managed</h3>
              <p className="text-3xl font-bold text-yellow-400">80</p>
            </div>
          </div>
        )}
        {activeSection !== "dashboard" && activeSection !== "courses" && activeSection !== "attendance" && activeSection !== "students"&&(
          <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{menuItems.find((item) => item.key === activeSection)?.name}</h3>
            <p className="text-gray-400 mt-2">Feature under development...</p>
          </div>
        )}
        {activeSection === "courses" && <AssignedCourses />}
        {activeSection === "attendance" && <AttendanceTracking />}
        {activeSection === "students" && <ManageStudents />}
      </main>
    </div>
  );
};

export default TeacherDashboard;
