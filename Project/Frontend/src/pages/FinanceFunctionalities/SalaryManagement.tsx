import { useState } from "react";

const SalaryManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [salaries, setSalaries] = useState([
    { name: "Mr. Anderson", role: "Teacher", amount: 5000, status: "Paid" },
    { name: "Ms. Davis", role: "Teacher", amount: 4800, status: "Pending" },
    { name: "John Doe", role: "Non-Teaching Staff", amount: 3000, status: "Paid" },
  ]);

  const updateStatus = (index: number, newStatus: string) => {
    const updatedSalaries = [...salaries];
    updatedSalaries[index].status = newStatus;
    setSalaries(updatedSalaries);
  };

  const filteredSalaries = salaries.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || staff.role === filter)
  );

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Salary Management</h3>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md flex-1"
        />
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-md text-white ${filter === "All" ? "bg-yellow-500" : "bg-gray-700"}`}
          >All</button>
          <button 
            onClick={() => setFilter("Teacher")}
            className={`px-4 py-2 rounded-md text-white ${filter === "Teacher" ? "bg-yellow-500" : "bg-gray-700"}`}
          >Teaching Staff</button>
          <button 
            onClick={() => setFilter("Non-Teaching Staff")}
            className={`px-4 py-2 rounded-md text-white ${filter === "Non-Teaching Staff" ? "bg-yellow-500" : "bg-gray-700"}`}
          >Non-Teaching Staff</button>
        </div>
      </div>
      
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-gray-300 text-left">
            <th className="p-3 border border-gray-700">Name</th>
            <th className="p-3 border border-gray-700">Role</th>
            <th className="p-3 border border-gray-700">Salary</th>
            <th className="p-3 border border-gray-700 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.map((staff, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="p-4 text-lg">{staff.name}</td>
              <td className="p-4">{staff.role}</td>
              <td className="p-4">${staff.amount}</td>
              <td className="p-3 text-center">
                <select
                  value={staff.status}
                  onChange={(e) => updateStatus(index, e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryManagement;
