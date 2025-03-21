import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface StudentFee {
  name: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Pending";
  class: string;
}

const FeeManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<StudentFee[]>([
    { name: "Alice Johnson", amount: 5000, status: "Paid", class: "Grade 10" },
    { name: "Bob Smith", amount: 4500, status: "Unpaid", class: "Grade 11" },
    { name: "Charlie Brown", amount: 4800, status: "Pending", class: "Grade 10" },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedClass === "" || student.class === selectedClass)
  );

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700 mx-auto">
      <h2 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Fee Management</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
        >
          <option value="">All Classes</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
        </select>
      </div>

      {/* Students Fee Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 text-gray-300">
          <thead>
          <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700 text-left">Student</th>
              <th className="p-3 border border-gray-700 text-center">Amount</th>
              <th className="p-3 border border-gray-700 text-center">Status</th>
              <th className="p-3 border border-gray-700 text-center">Class</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{student.name}</td>
                <td className="p-3 text-center">${student.amount}</td>
                <td className="p-3 text-center">
                  <span className="flex items-center justify-center gap-2 font-medium">
                    {student.status === "Paid" && (
                      <FaCheckCircle className="text-green-400 text-lg" />
                    )}
                    {student.status === "Unpaid" && (
                      <FaTimesCircle className="text-red-400 text-lg" />
                    )}
                    {student.status === "Pending" && (
                      <FaClock className="text-yellow-400 text-lg" />
                    )}
                    {student.status}
                  </span>
                </td>
                <td className="p-3 text-center">{student.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;
