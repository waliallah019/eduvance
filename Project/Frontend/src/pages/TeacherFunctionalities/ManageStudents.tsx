import { useState } from "react";
import { Search, Filter, Edit, BarChart, Award } from "lucide-react";

interface Student {
  name: string;
  id: string;
  performance: string;
  grades: {
    assignments: number;
    midterm: number;
    finals?: number;
  };
  attendance: number;
  status: string;
  feedback: string[];
}

const ManageStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students] = useState<Student[]>([
    {
      name: "Alice Johnson",
      id: "STU001",
      performance: "Good",
      grades: {
        assignments: 88,
        midterm: 92,
        finals: 90
      },
      attendance: 95,
      status: "Active",
      feedback: ["Excellent participation", "Strong analytical skills"]
    },
    {
      name: "Bob Smith",
      id: "STU002",
      performance: "Average",
      grades: {
        assignments: 75,
        midterm: 78,
        finals: 82
      },
      attendance: 85,
      status: "Active",
      feedback: ["Needs improvement in homework submission", "Shows potential"]
    },
    {
      name: "Charlie Brown",
      id: "STU003",
      performance: "Excellent",
      grades: {
        assignments: 95,
        midterm: 94,
        finals: 96
      },
      attendance: 98,
      status: "Active",
      feedback: ["Outstanding performance", "Great leadership skills"]
    },
  ]);

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-blue-400';
      case 'average':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const calculateAverage = (grades: Student['grades']) => {
    const values = Object.values(grades).filter(grade => grade !== undefined);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-6">Manage Students</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 pl-10 text-gray-300"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Performance</th>
              <th className="p-3 text-center">Average Grade</th>
              <th className="p-3 text-center">Attendance</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{student.id}</td>
                <td className="p-3">{student.name}</td>
                <td className={`p-3 text-center ${getPerformanceColor(student.performance)}`}>
                  <span className="flex items-center justify-center">
                    <Award className="w-4 h-4 mr-2" />
                    {student.performance}
                  </span>
                </td>
                <td className="p-3 text-center">{calculateAverage(student.grades)}%</td>
                <td className="p-3 text-center">{student.attendance}%</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    {student.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
<button className="p-2 hover:bg-gray-700 rounded-lg">
                      <BarChart className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;