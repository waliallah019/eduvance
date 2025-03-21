import { useState } from "react";

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
}

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alice Johnson", rollNumber: "STU001", className: "10th", section: "A" },
    { id: 2, name: "Bob Smith", rollNumber: "STU002", className: "9th", section: "B" },
    { id: 3, name: "Charlie Brown", rollNumber: "STU003", className: "8th", section: "C" }
  ]);

  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<Student>({
    id: 0,
    name: "",
    rollNumber: "",
    className: "",
    section: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student>({
    id: 0,
    name: "",
    rollNumber: "",
    className: "",
    section: "",
  });

  const classes = ["All", "8th", "9th", "10th", "11th", "12th"];

  // Filter students
  const filteredStudents = students.filter(student =>
    (selectedClass === "All" || student.className === selectedClass) &&
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNumber.includes(searchQuery))
  );

  // Add new student
  const handleAddStudent = () => {
    if (newStudent.name && newStudent.rollNumber && newStudent.className && newStudent.section) {
      setStudents([...students, { ...newStudent, id: students.length + 1 }]);
      setNewStudent({ id: 0, name: "", rollNumber: "", className: "", section: "" });
      setModalOpen(false);
    }
  };

  // Delete student
  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Edit student
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditModalOpen(true);
  };

  const handleUpdateStudent = () => {
    if (editingStudent.name && editingStudent.rollNumber && editingStudent.className && editingStudent.section) {
      setStudents(students.map(student => 
        student.id === editingStudent.id ? editingStudent : student
      ));
      setEditModalOpen(false);
    }
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Manage Students</h3>

      {/* Search & Class Selection */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by name or roll number"
          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Roll No.</th>
              <th className="p-3 border border-gray-700">Name</th>
              <th className="p-3 border border-gray-700">Class</th>
              <th className="p-3 border border-gray-700">Section</th>
              <th className="p-3 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{student.rollNumber}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.className}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button 
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Button */}
      <div className="mt-6">
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
        >
          + Add Student
        </button>
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">Add New Student</h2>
            <input 
              type="text"
              placeholder="Student Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Roll Number"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.rollNumber}
              onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            />
            <select 
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.className}
              onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
            >
              <option value="">Select Class</option>
              {classes.slice(1).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <input 
              type="text"
              placeholder="Section"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.section}
              onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="text-gray-400 hover:underline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStudent} 
                className="bg-yellow-400 text-black px-4 py-2 rounded-md font-normal"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">Edit Student</h2>
            <input 
              type="text"
              placeholder="Student Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.name}
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Roll Number"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.rollNumber}
              onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
            />
            <select 
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.className}
              onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
            >
              <option value="">Select Class</option>
              {classes.slice(1).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <input 
              type="text"
              placeholder="Section"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.section}
              onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="text-gray-400 hover:underline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStudent} 
                className="bg-yellow-400 text-black px-4 py-2 rounded-md font-normal"
              >
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;