import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define types
interface User {
  id: string;
  name: string;
  role: "student" | "teaching_staff" | "non_teaching_staff";
  class?: string; // For students
  department?: string; // For staff
  profileImage?: string; // Profile image URL
}

type AttendanceStatus = "present" | "absent" | "leave";
type ViewMode = "mark" | "view" | "analytics";
type ViewFilter = "individual" | "class" | "department" | "all";

interface AttendanceRecord {
  userId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
}

// Historical attendance data for analytics
interface HistoricalAttendance {
  date: string;
  present: number;
  absent: number;
  leave: number;
  total: number;
}

const AttendanceManagement = () => {
  // States
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("students");
  const [viewMode, setViewMode] = useState<ViewMode>("mark");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceStatus>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("week");
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  // Mock data - in a real application, this would come from an API
  const classes = ["Class 9-A", "Class 9-B", "Class 10-A", "Class 10-B", "Class 11-A", "Class 11-B", "Class 12-A", "Class 12-B"];
  const departments = ["Science", "Mathematics", "English", "History", "Geography", "Physical Education", "Administration", "Maintenance", "Cafeteria"];
  
  // Extensive dummy data
  const dummyUsers: User[] = [
    // Students
    { id: "s1", name: "Alice Johnson", role: "student", class: "Class 9-A", profileImage: "/api/placeholder/40/40" },
    { id: "s2", name: "Bob Smith", role: "student", class: "Class 9-A", profileImage: "/api/placeholder/40/40" },
    { id: "s3", name: "Charlie Brown", role: "student", class: "Class 9-A", profileImage: "/api/placeholder/40/40" },
    { id: "s4", name: "Diana Prince", role: "student", class: "Class 9-B", profileImage: "/api/placeholder/40/40" },
    { id: "s5", name: "Ethan Hunt", role: "student", class: "Class 9-B", profileImage: "/api/placeholder/40/40" },
    { id: "s6", name: "Fiona Apple", role: "student", class: "Class 10-A", profileImage: "/api/placeholder/40/40" },
    { id: "s7", name: "George Michael", role: "student", class: "Class 10-A", profileImage: "/api/placeholder/40/40" },
    { id: "s8", name: "Hannah Montana", role: "student", class: "Class 10-B", profileImage: "/api/placeholder/40/40" },
    { id: "s9", name: "Ian Malcolm", role: "student", class: "Class 11-A", profileImage: "/api/placeholder/40/40" },
    { id: "s10", name: "Jennifer Lopez", role: "student", class: "Class 11-B", profileImage: "/api/placeholder/40/40" },
    { id: "s11", name: "Kevin Hart", role: "student", class: "Class 12-A", profileImage: "/api/placeholder/40/40" },
    { id: "s12", name: "Linda Hamilton", role: "student", class: "Class 12-B", profileImage: "/api/placeholder/40/40" },
    
    // Teaching Staff
    { id: "t1", name: "Mr. Anderson", role: "teaching_staff", department: "Science", profileImage: "/api/placeholder/40/40" },
    { id: "t2", name: "Ms. Davis", role: "teaching_staff", department: "Mathematics", profileImage: "/api/placeholder/40/40" },
    { id: "t3", name: "Dr. Wilson", role: "teaching_staff", department: "Science", profileImage: "/api/placeholder/40/40" },
    { id: "t4", name: "Mrs. Thompson", role: "teaching_staff", department: "English", profileImage: "/api/placeholder/40/40" },
    { id: "t5", name: "Mr. Jackson", role: "teaching_staff", department: "History", profileImage: "/api/placeholder/40/40" },
    { id: "t6", name: "Ms. Rodriguez", role: "teaching_staff", department: "Mathematics", profileImage: "/api/placeholder/40/40" },
    { id: "t7", name: "Dr. Patel", role: "teaching_staff", department: "Science", profileImage: "/api/placeholder/40/40" },
    { id: "t8", name: "Mrs. Kim", role: "teaching_staff", department: "Geography", profileImage: "/api/placeholder/40/40" },
    { id: "t9", name: "Mr. Williams", role: "teaching_staff", department: "Physical Education", profileImage: "/api/placeholder/40/40" },
    
    // Non-Teaching Staff
    { id: "n1", name: "John Doe", role: "non_teaching_staff", department: "Administration", profileImage: "/api/placeholder/40/40" },
    { id: "n2", name: "Jane Doe", role: "non_teaching_staff", department: "Administration", profileImage: "/api/placeholder/40/40" },
    { id: "n3", name: "Robert Johnson", role: "non_teaching_staff", department: "Maintenance", profileImage: "/api/placeholder/40/40" },
    { id: "n4", name: "Sarah Connor", role: "non_teaching_staff", department: "Cafeteria", profileImage: "/api/placeholder/40/40" },
    { id: "n5", name: "Michael Scott", role: "non_teaching_staff", department: "Administration", profileImage: "/api/placeholder/40/40" },
    { id: "n6", name: "Kelly Kapoor", role: "non_teaching_staff", department: "Administration", profileImage: "/api/placeholder/40/40" },
  ];

  // Generate random attendance for each user for today
  if (Object.keys(attendanceRecords).length === 0) {
    const statuses: AttendanceStatus[] = ["present", "absent", "leave"];
    const initialRecords: Record<string, AttendanceStatus> = {};
    
    dummyUsers.forEach(user => {
      const randomIndex = Math.floor(Math.random() * 10);
      if (randomIndex < 7) { // 70% present
        initialRecords[user.id] = "present";
      } else if (randomIndex < 9) { // 20% absent
        initialRecords[user.id] = "absent";
      } else { // 10% leave
        initialRecords[user.id] = "leave";
      }
    });
    
    setAttendanceRecords(initialRecords);
  }

  // Dummy historical attendance data for charts
  const generateHistoricalData = (): HistoricalAttendance[] => {
    const data: HistoricalAttendance[] = [];
    const today = new Date();
    const filterRole = selectedCategory;
    
    // Number of days to generate based on selected time range
    let days = 7;
    if (selectedTimeRange === "month") days = 30;
    if (selectedTimeRange === "quarter") days = 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Count users of selected role
      const roleUsers = dummyUsers.filter(user => user.role === filterRole).length;
      
      // Generate random attendance numbers
      const present = Math.floor(roleUsers * (0.7 + Math.random() * 0.2)); // 70-90% present
      const absent = Math.floor((roleUsers - present) * (0.5 + Math.random() * 0.5)); // Distribute remaining between absent and leave
      const leave = roleUsers - present - absent;
      
      data.push({
        date: dateStr,
        present,
        absent,
        leave,
        total: roleUsers
      });
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  // Calculate current attendance statistics
  const calculateAttendanceStats = () => {
    const filteredUsers = dummyUsers.filter(user => user.role === selectedCategory);
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    
    filteredUsers.forEach(user => {
      const status = attendanceRecords[user.id];
      if (status === "present") presentCount++;
      else if (status === "absent") absentCount++;
      else if (status === "leave") leaveCount++;
    });
    
    return [
      { name: "Present", value: presentCount, color: "#4CAF50" },
      { name: "Absent", value: absentCount, color: "#F44336" },
      { name: "Leave", value: leaveCount, color: "#FF9800" }
    ];
  };

  // Filter users based on category, class/department, and search query
  const getFilteredUsers = () => {
    let filtered = dummyUsers.filter(user => user.role === selectedCategory);

    if (viewFilter === "class" && selectedClass !== "All Classes") {
      filtered = filtered.filter(user => user.class === selectedClass);
    }

    if (viewFilter === "department" && selectedDepartment !== "All Departments") {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    if (viewFilter === "individual" && selectedUser) {
      filtered = filtered.filter(user => user.id === selectedUser);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  };

  // Handle attendance change
  const handleAttendanceChange = (userId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prevRecords => ({
      ...prevRecords,
      [userId]: status,
    }));
  };

  // Handle bulk attendance actions
  const handleBulkAction = (status: AttendanceStatus) => {
    const filteredUsers = getFilteredUsers();
    const newRecords = { ...attendanceRecords };
    
    filteredUsers.forEach(user => {
      newRecords[user.id] = status;
    });
    
    setAttendanceRecords(newRecords);
  };

  // Handle remarks change
  const handleRemarksChange = (userId: string, text: string) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [userId]: text,
    }));
  };

  // Save attendance records
  const saveAttendanceRecords = () => {
    // In a real application, this would send the data to an API
    const records: AttendanceRecord[] = Object.entries(attendanceRecords).map(([userId, status]) => ({
      userId,
      date: attendanceDate,
      status,
      markedBy: "admin", // This would come from auth context in a real app
      remarks: remarks[userId] || "",
    }));
    
    console.log("Saving records:", records);
    alert("Attendance records saved successfully!");
  };

  // Calculate attendance percentages for classes
  const getClassAttendanceData = () => {
    const classData: {name: string, percentage: number}[] = [];
    
    classes.forEach(className => {
      const classStudents = dummyUsers.filter(user => 
        user.role === "student" && user.class === className
      );
      
      let presentCount = 0;
      classStudents.forEach(student => {
        if (attendanceRecords[student.id] === "present") {
          presentCount++;
        }
      });
      
      const percentage = classStudents.length > 0 
        ? (presentCount / classStudents.length) * 100 
        : 0;
      
      classData.push({
        name: className,
        percentage: parseFloat(percentage.toFixed(1))
      });
    });
    
    return classData;
  };

  // Render filter controls based on view mode and category
  const renderFilterControls = () => {
    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
          {/* View Mode Selection */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Mode:</span>
            <select 
              className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
            >
              <option value="mark">Mark Attendance</option>
              <option value="view">View Attendance</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>

          {viewMode !== "analytics" && (
            <>
              {/* View Filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Filter by:</span>
                <select 
                  className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                  value={viewFilter}
                  onChange={(e) => setViewFilter(e.target.value as ViewFilter)}
                >
                  <option value="all">All</option>
                  {selectedCategory === "students" && <option value="class">Class</option>}
                  {(selectedCategory === "teaching_staff" || selectedCategory === "non_teaching_staff") && 
                    <option value="department">Department</option>}
                  <option value="individual">Individual</option>
                </select>
              </div>

              {/* Class Selection (for students) */}
              {selectedCategory === "students" && viewFilter === "class" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Class:</span>
                  <select 
                    className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="All Classes">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department Selection (for staff) */}
              {(selectedCategory === "teaching_staff" || selectedCategory === "non_teaching_staff") && 
                viewFilter === "department" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Department:</span>
                  <select 
                    className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="All Departments">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Individual Selection */}
              {viewFilter === "individual" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Select Person:</span>
                  <select 
                    className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select a person</option>
                    {dummyUsers
                      .filter(user => user.role === selectedCategory)
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </>
          )}

          {viewMode === "analytics" && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Time Range:</span>
              <select 
                className="bg-gray-700 text-white p-2 rounded-md border border-gray-600"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          )}

          {/* Search Box */}
          {viewMode !== "analytics" && (
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="text"
                placeholder="Search by name..."
                className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 w-full md:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render attendance analytics
  const renderAnalytics = () => {
    const attendanceStats = calculateAttendanceStats();
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Attendance Summary Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Today's Attendance Summary
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {attendanceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4 md:mt-0">
                {attendanceStats.map((stat) => (
                  <div key={stat.name} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: stat.color }}
                    ></div>
                    <div className="text-gray-300">
                      <span className="font-semibold">{stat.name}:</span> {stat.value} users
                    </div>
                  </div>
                ))}
                <div className="text-gray-300 mt-2">
                  <span className="font-semibold">Total:</span> {attendanceStats.reduce((sum, stat) => sum + stat.value, 0)} users
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Trend Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Attendance Trend ({selectedTimeRange === "week" ? "Last 7 Days" : 
                              selectedTimeRange === "month" ? "Last 30 Days" : "Last 90 Days"})
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" name="Present" />
                  <Bar dataKey="absent" fill="#F44336" name="Absent" />
                  <Bar dataKey="leave" fill="#FF9800" name="Leave" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class-wise Attendance */}
          {selectedCategory === "students" && (
            <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 md:col-span-2">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                Class-wise Attendance Percentage
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getClassAttendanceData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                    <Bar dataKey="percentage" fill="#8884d8">
                      {getClassAttendanceData().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.percentage > 90 ? '#4CAF50' : 
                               entry.percentage > 75 ? '#8BC34A' :
                               entry.percentage > 60 ? '#FFEB3B' :
                               entry.percentage > 40 ? '#FF9800' : '#F44336'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render attendance table
  const renderAttendanceTable = () => {
    const filteredUsers = getFilteredUsers();
    
    return (
      <div className="mt-6 overflow-x-auto">
        {viewMode === "mark" && (
          <div className="mb-4 flex gap-2">
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              onClick={() => handleBulkAction("present")}
            >
              Mark All Present
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              onClick={() => handleBulkAction("absent")}
            >
              Mark All Absent
            </button>
            <button 
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
              onClick={() => handleBulkAction("leave")}
            >
              Mark All On Leave
            </button>
          </div>
        )}
        
        {filteredUsers.length === 0 ? (
          <div className="text-center p-4 bg-gray-800 text-gray-300 rounded-lg">
            No users found matching the selected criteria.
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-gray-300 text-left">
                <th className="p-3 border border-gray-700">Name</th>
                {selectedCategory === "students" && (
                  <th className="p-3 border border-gray-700">Class</th>
                )}
                {(selectedCategory === "teaching_staff" || selectedCategory === "non_teaching_staff") && (
                  <th className="p-3 border border-gray-700">Department</th>
                )}
                <th className="p-3 border border-gray-700 text-center">Status</th>
                {viewMode === "mark" && (
                  <th className="p-3 border border-gray-700">Remarks</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} 
                    className={`border-b border-gray-700 hover:bg-gray-800 ${
                      attendanceRecords[user.id] === "absent" ? "bg-red-900 bg-opacity-20" : 
                      attendanceRecords[user.id] === "leave" ? "bg-yellow-900 bg-opacity-20" : ""
                    }`}
                >
                  <td className="p-4 text-lg text-gray-200 flex items-center">
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-3 bg-gray-600"
                    />
                    {user.name}
                  </td>
                  
                  {selectedCategory === "students" && (
                    <td className="p-3 text-gray-300">{user.class}</td>
                  )}
                  
                  {(selectedCategory === "teaching_staff" || selectedCategory === "non_teaching_staff") && (
                    <td className="p-3 text-gray-300">{user.department}</td>
                  )}
                  
                  <td className="p-3 text-center">
                    <select
                      value={attendanceRecords[user.id] || "present"}
                      onChange={(e) => handleAttendanceChange(user.id, e.target.value as AttendanceStatus)}
                      className={`border p-2 rounded-md focus:ring-2 focus:ring-yellow-400 ${
                        attendanceRecords[user.id] === "present" ? "bg-green-800 border-green-600 text-white" : 
                        attendanceRecords[user.id] === "absent" ? "bg-red-800 border-red-600 text-white" : 
                        "bg-yellow-800 border-yellow-600 text-white"
                      }`}
                      disabled={viewMode === "view"}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="leave">Leave</option>
                    </select>
                  </td>
                  
                  {viewMode === "mark" && (
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Add remarks (optional)"
                        className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full focus:ring-2 focus:ring-yellow-400"
                        value={remarks[user.id] || ""}
                        onChange={(e) => handleRemarksChange(user.id, e.target.value)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // Render brief tutorial overlay
  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full border border-yellow-400">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Welcome to Attendance Management</h2>
          <div className="text-gray-300 space-y-4">
            <p>This system allows you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-yellow-400">Mark Attendance:</span> Record daily attendance for students and staff</li>
              <li><span className="text-yellow-400">View Attendance:</span> Check historical attendance records</li>
              <li><span className="text-yellow-400">Analytics:</span> Visualize attendance data with interactive charts</li>
            </ul>
            <p>Use the category buttons to switch between Students, Teaching Staff, and Non-Teaching Staff.</p>
            <p>Try the different filters to view data by class, department, or individual.</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400"
              onClick={() => setShowTutorial(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      {renderTutorial()}
      
      <h2 className="text-3xl font-semibold text-yellow-400 text-center mb-6">Attendance Management</h2>
      
      {/* Date Selection & Download Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
        <label className="text-gray-300 flex items-center gap-2">
            <span>Date:</span>
            <input
              type="date"
              className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            onClick={() => console.log("Generate report")}
          >
            Generate Report
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            onClick={() => console.log("Export data")}
          >
            Export CSV
          </button>
        </div>
      </div>
      
      {/* Category Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["students", "teaching_staff", "non_teaching_staff"].map((category) => (
          <button
            key={category}
            className={`p-4 rounded-lg text-center transition-all ${
              selectedCategory === category
                ? "bg-yellow-500 text-gray-900 shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className="text-lg font-medium capitalize">
              {category === "teaching_staff"
                ? "Teaching Staff"
                : category === "non_teaching_staff"
                ? "Non-Teaching Staff"
                : "Students"}
            </span>
          </button>
        ))}
      </div>
      
      {/* Filter Controls */}
      {renderFilterControls()}
      
      {/* Content based on view mode */}
      {viewMode === "analytics" ? renderAnalytics() : renderAttendanceTable()}
      
      {/* Save Button (Only shown in mark mode) */}
      {viewMode === "mark" && (
        <div className="mt-6 flex justify-end">
          <button 
            className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-md hover:bg-yellow-400 shadow-lg"
            onClick={saveAttendanceRecords}
          >
            Save Attendance Records
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;