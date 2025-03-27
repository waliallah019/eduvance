import { useState, useEffect } from "react";
import { Course } from "../../interface/course.interface";
import { Class, Section } from "../../interface/class.interface";
import { TeacherStaff as Teacher } from "../../interface/TeacherStaff";

// interface TeacherAssignment {
//   _id: string;
//   section: Section;
//   teacher: Teacher; // Change to Teacher object
//   course: Course;
//   timeSlot: string;
// }



const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    _id: "",
    name: "",
    code: "",
    instructors: [],
    description: "",
    classIds: [],
    isActive: 1,
  });
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  // Removed unused teacherAssignments state
  const [teachers, setTeachers] = useState<Teacher[]>([]);

useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/staff/teachers");
      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await response.json();
      setTeachers(data.filter((teacher: Teacher) => teacher.isActive === true));
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  fetchTeachers();
}, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.filter((course: Course) => course.isActive === 1));
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchClasses();
  }, []);

  const fetchSections = async (classIds: string[]) => {
    try {
      const response = await fetch("http://localhost:5000/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classIds }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await response.json();
      
      // Map sections to include class names
      const sectionsWithClassNames = data.map((section: Section) => {
        const classObj = classes.find((cls) => cls._id === section.classID);
        return {
          ...section,
          className: classObj ? classObj.className : "Unknown Class",
        };
      });
  
      setSections(sectionsWithClassNames);
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.includes(searchQuery)
  );

  const handleSaveCourse = async () => {
    if (newCourse.name && newCourse.code && newCourse.description) {
      const courseToSave = { ...newCourse, classIds: selectedClassIds };
      try {
        let response;
        if (isEditing && editingCourseId) {
          response = await fetch(`http://localhost:5000/api/courses/${editingCourseId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(courseToSave),
          });
        } else {
          response = await fetch("http://localhost:5000/api/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(courseToSave),
          });
        }

        if (!response.ok) {
          throw new Error("Failed to save course");
        }

        const data = await response.json();
        if (isEditing) {
          setCourses(courses.map((course) => (course._id === editingCourseId ? data : course)));
        } else {
          setCourses([...courses, data]);
        }
        setNewCourse({
          _id: "",
          name: "",
          code: "",
          instructors: [],
          description: "",
          classIds: [],
          isActive: 1,
        });
        setSelectedClassIds([]);
        setModalOpen(false);
        setIsEditing(false);
        setEditingCourseId(null);
      } catch (err) {
        console.error("Failed to save course:", err);
      }
    }
  };

  const handleEditCourse = (course: Course) => {
    setNewCourse(course);
    setSelectedClassIds(course.classIds);
    setIsEditing(true);
    setEditingCourseId(course._id);
    setModalOpen(true);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleAssignTeachers = async (courseId: string, currentTeachers: string[]) => {
    setSelectedCourseId(courseId);
    setSelectedTeachers(currentTeachers);
    const course = courses.find((course) => course._id === courseId);
    if (course) {
      await fetchSections(course.classIds);
    }
    setAssignModalOpen(true);
  };

  const toggleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  const toggleSectionSelection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleSaveTeacherAssignments = async () => {
    if (selectedCourseId !== null && selectedTeachers.length > 0 && selectedSections.length > 0) {
      const course = courses.find((course) => course._id === selectedCourseId);
  
      if (course) {
        // Step 1: Save teacher assignments
        const assignments = selectedSections.map((sectionId) => {
          const section = sections.find((section) => section._id === sectionId);
          return {
            section: section?._id, // Send section ID
            teacher: selectedTeachers[0], // Send teacher ID
            course: course._id, // Send course ID
            timeSlot: "None", // Default time slot
          };
        });
  
        try {
          // Save teacher assignments
          const assignmentResponse = await fetch("http://localhost:5000/api/teacher-assignments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assignments),
          });
  
          if (!assignmentResponse.ok) {
            throw new Error("Failed to save teacher assignments");
          }
  
          // Step 2: Update the course's instructors with the assigned teachers' names
          const assignedTeachers = selectedTeachers.map((teacherId) => {
            const teacher = teachers.find((t) => t._id === teacherId);
            return teacher?.name || "Unknown Teacher";
          });
  
          const updatedCourse = {
            ...course,
            instructors: assignedTeachers, // Update the instructors array with teacher names
          };
  
          // Step 3: Save the updated course to the backend
          const courseResponse = await fetch(`http://localhost:5000/api/courses/${selectedCourseId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCourse),
          });
  
          if (!courseResponse.ok) {
            throw new Error("Failed to update course with assigned teachers");
          }
  
          // Step 4: Update the state with the new course data
          const updatedCourseData = await courseResponse.json();
          setCourses((prevCourses) =>
            prevCourses.map((c) => (c._id === selectedCourseId ? updatedCourseData : c))
          );
  
          // Step 5: Reset modal and selections
          setAssignModalOpen(false);
          setSelectedSections([]);
          setSelectedTeachers([]);
          alert("Teacher successfully assigned to sections and course updated!");
        } catch (err) {
          console.error("Failed to save teacher assignments or update course:", err);
        }
      }
    } else {
      alert("Please select at least one section and one teacher.");
    }
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
              <th className="p-3 border border-gray-700">CourseCode</th>
              <th className="p-3 border border-gray-700">CourseName</th>
              <th className="p-3 border border-gray-700">Assigned Teachers</th>
              <th className="p-3 border border-gray-700">Course Description</th>
              <th className="p-3 border border-gray-700">Assigned Classes</th>
              <th className="p-3 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course._id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{course.code}</td>
                  <td className="p-3">{course.name}</td>
                  <td className="p-3">
                    {course.instructors.length > 0 ? course.instructors.join(", ") : "No teacher assigned"}
                  </td>
                  <td className="p-3">{course.description}</td>
                  <td className="p-3">
                    {course.classIds.length > 0
                      ? course.classIds
                          .map(
                            (classId) => classes.find((cls) => cls._id === classId)?.className
                          )
                          .join(", ")
                      : "No classes assigned"}
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditCourse(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-emerald-400 hover:underline"
                      onClick={() => handleAssignTeachers(course._id, course.instructors)}
                    >
                      Assign Teacher
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setNewCourse({
              _id: "",
              name: "",
              code: "",
              instructors: [],
              description: "",
              classIds: [],
              isActive: 1,
            });
            setSelectedClassIds([]);
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
              placeholder="Description"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />

            <div className="mb-4">
              <label className="text-white">Select Classes:</label>
              <div className="flex flex-col gap-2 mt-2">
                {classes.map((cls) => (
                  <label key={cls._id} className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={selectedClassIds.includes(cls._id)}
                      onChange={() => toggleClassSelection(cls._id)}
                      className="form-checkbox text-yellow-400"
                    />
                    {cls.className}
                  </label>
                ))}
              </div>
            </div>

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

{assignModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md">
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
      <h2 className="text-yellow-400 text-xl mb-4">Assign Teachers and Sections</h2>

      <div className="mb-4">
        <label className="text-white">Select Sections:</label>
        <div className="flex flex-col gap-2 mt-2">
          {sections.map((section) => (
            <label key={section._id} className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={selectedSections.includes(section._id)}
                onChange={() => toggleSectionSelection(section._id)}
                className="form-checkbox text-yellow-400"
              />
              {/* Display class name and section name together */}
              {`${classes.find((cls) => cls._id === section.classID)?.className || "Unknown Class"} - Section ${section.sectionName}`}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
  <label className="text-white">Select Teachers:</label>
  <div className="flex flex-col gap-2 mt-2">
    {teachers.map((teacher) => (
      <label key={teacher._id} className="flex items-center gap-2 text-white">
        <input
          type="checkbox"
          checked={selectedTeachers.includes(teacher._id)}
          onChange={() => toggleTeacherSelection(teacher._id)}
          className="form-checkbox text-yellow-400"
        />
        {teacher.name}
      </label>
    ))}
  </div>
</div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          className="text-gray-400 hover:underline"
          onClick={() => setAssignModalOpen(false)}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTeacherAssignments}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageCourses;