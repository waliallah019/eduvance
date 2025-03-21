import { useState } from "react";

const ResultTracking = () => {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [results, setResults] = useState([
    { name: "Alice Johnson", subject: "Math", marks: 85, grade: "A", class: "10A" },
    { name: "Bob Smith", subject: "Science", marks: 78, grade: "B", class: "10B" },
    { name: "Charlie Brown", subject: "English", marks: 90, grade: "A+", class: "10A" },
  ]);

  const filteredResults = results.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedClass === "" || student.class === selectedClass) &&
    (selectedSubject === "" || student.subject === selectedSubject)
  );

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Result Tracking</h3>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full"
        />
        <select
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">All Classes</option>
          <option value="10A">10A</option>
          <option value="10B">10B</option>
        </select>
        <select
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
        </select>
      </div>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 border border-gray-700">Student</th>
            <th className="p-3 border border-gray-700">Subject</th>
            <th className="p-3 border border-gray-700">Marks</th>
            <th className="p-3 border border-gray-700">Grade</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="p-3">{result.name}</td>
              <td className="p-3">{result.subject}</td>
              <td className="p-3">{result.marks}</td>
              <td className="p-3">{result.grade}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { name: "Mathematics", teacher: "Mr. Anderson", students: 25 },
    { name: "Science", teacher: "Ms. Davis", students: 20 },
    { name: "English", teacher: "Mrs. Brown", students: 30 },
  ]);
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Course Management</h3>
      <input
        type="text"
        placeholder="Search course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full mb-4"
      />
      <table className="w-full border-collapse border border-gray-700 text-gray-300">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 border border-gray-700">Course</th>
            <th className="p-3 border border-gray-700">Teacher</th>
            <th className="p-3 border border-gray-700">Students Enrolled</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="p-3">{course.name}</td>
              <td className="p-3">{course.teacher}</td>
              <td className="p-3">{course.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ResultTracking, CourseManagement };