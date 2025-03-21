import { useState } from "react";

interface Course {
  id: number;
  name: string;
  code: string;
  instructor: string;
  duration: string;
}

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Mathematics", code: "MTH101", instructor: "John Doe", duration: "6 months" },
    { id: 2, name: "Physics", code: "PHY102", instructor: "Jane Smith", duration: "4 months" },
    { id: 3, name: "Chemistry", code: "CHM103", instructor: "Alice Brown", duration: "5 months" }
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({ id: 0, name: "", code: "", instructor: "", duration: "" });

  // Filter courses
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.includes(searchQuery)
  );

  // Add or Update Course
  const handleSaveCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.instructor && newCourse.duration) {
      if (isEditing && editingCourseId !== null) {
        // Update course
        setCourses(courses.map(course => (course.id === editingCourseId ? { ...newCourse, id: editingCourseId } : course)));
        setIsEditing(false);
        setEditingCourseId(null);
      } else {
        // Add new course
        setCourses([...courses, { ...newCourse, id: courses.length + 1 }]);
      }
      setNewCourse({ id: 0, name: "", code: "", instructor: "", duration: "" });
      setModalOpen(false);
    }
  };

  // Edit course
  const handleEditCourse = (course: Course) => {
    setNewCourse(course);
    setIsEditing(true);
    setEditingCourseId(course.id);
    setModalOpen(true);
  };

  // Delete course
  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Manage Courses</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by name or code"
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Code</th>
              <th className="p-3 border border-gray-700">Name</th>
              <th className="p-3 border border-gray-700">Instructor</th>
              <th className="p-3 border border-gray-700">Duration</th>
              <th className="p-3 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <tr key={course.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{course.code}</td>
                  <td className="p-3">{course.name}</td>
                  <td className="p-3">{course.instructor}</td>
                  <td className="p-3">{course.duration}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button 
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditCourse(course)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => {
            setNewCourse({ id: 0, name: "", code: "", instructor: "", duration: "" });
            setIsEditing(false);
            setModalOpen(true);
          }} 
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
        >
          + Add Course
        </button>
      </div>
      
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">{isEditing ? "Edit Course" : "Add New Course"}</h2>
            <input 
              type="text"
              placeholder="Course Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Course Code"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Instructor"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
            />
            <input 
              type="text"
              placeholder="Duration"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="text-gray-400 hover:underline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCourse} 
                className="bg-yellow-400 text-black px-4 py-2 rounded-md"
              >
                {isEditing ? "Update Course" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
