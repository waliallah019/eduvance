// AttendanceTracking.tsx
import { useState } from "react";
import { Calendar, Clock, Book, Filter, Download } from "lucide-react";

interface Student {
  name: string;
  present: boolean;
  totalClasses: number;
  attendancePercentage: number;
  lastAttendance: string;
  notes?: string;
}

const AttendanceTracking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState("MATH101");
  const [students, setStudents] = useState<Student[]>([
    {
      name: "Alice Johnson",
      present: false,
      totalClasses: 45,
      attendancePercentage: 92,
      lastAttendance: "2024-02-20",
      notes: "Medical leave from 15-17 Feb"
    },
    {
      name: "Bob Smith",
      present: false,
      totalClasses: 42,
      attendancePercentage: 84,
      lastAttendance: "2024-02-20"
    },
    {
      name: "Charlie Brown",
      present: false,
      totalClasses: 44,
      attendancePercentage: 88,
      lastAttendance: "2024-02-19"
    },
  ]);

  const toggleAttendance = (index: number) => {
    const updatedStudents = [...students];
    updatedStudents[index].present = !updatedStudents[index].present;
    setStudents(updatedStudents);
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-6">Mark Attendance</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-2">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 pl-10 text-gray-300"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-2">Select Course</label>
          <div className="relative">
            <Book className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 pl-10 text-gray-300"
            >
              <option value="MATH101">Mathematics (MATH101)</option>
              <option value="SCI102">Science (SCI102)</option>
              <option value="ENG103">English (ENG103)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-center">Attendance</th>
              <th className="p-3 text-center">Total Classes</th>
              <th className="p-3 text-center">Percentage</th>
              <th className="p-3 text-center">Last Attended</th>
              <th className="p-3 text-center">Notes</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{student.name}</td>
                <td className="p-3 text-center">
                  <button
                    className={`px-4 py-1 rounded-full ${
                      student.present
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } transition-colors`}
                    onClick={() => toggleAttendance(index)}
                  >
                    {student.present ? "Present" : "Absent"}
                  </button>
                </td>
                <td className="p-3 text-center">{student.totalClasses}</td>
                <td className="p-3 text-center">
                  <span className={`${
                    student.attendancePercentage >= 90 ? "text-green-400" :
                    student.attendancePercentage >= 75 ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {student.attendancePercentage}%
                  </span>
                </td>
                <td className="p-3 text-center">{student.lastAttendance}</td>
                <td className="p-3 text-center">
                  {student.notes && (
                    <span className="text-sm text-gray-400">{student.notes}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};
export default AttendanceTracking;
