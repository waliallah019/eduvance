import { useState, useEffect } from "react";
import { Course } from "../../interface/course.interface";
import { Class, Section } from "../../interface/class.interface";
import { TeacherStaff as Teacher } from "../../interface/TeacherStaff";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ICourseAssignment} from "../../interface/courseAssignment.interface";
import TableLoadingSpinner from "../../components/ui/TableLoadingSpinner";



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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sectionAssignments, setSectionAssignments] = useState<Record<string, string | undefined>>({});

  // Add to your state declarations
const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);


const [assignmentDetails, setAssignmentDetails] = useState<ICourseAssignment[]>([]); // Use a proper interface for assignments
const [tableLoaing, setTableLoading] = useState(false);
const [loading, setLoading] = useState<boolean>(false);


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
      setTableLoading(true); // Start loading
      const response = await fetch("http://localhost:5000/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data: { course: Course; unassignedSectionNames: string[] }[] = await response.json();
      const activeCourses = data
        .filter(entry => entry.course.isActive === 1)
        .map(entry => ({
          ...entry.course,
          unassignedSectionNames: entry.unassignedSectionNames,
        }));

      setCourses(activeCourses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setTableLoading(false); // Stop loading regardless of success/failure
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
        let successMessage = "";
  
        if (isEditing && editingCourseId) {
          response = await fetch(`http://localhost:5000/api/courses/${editingCourseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseToSave),
          });
          successMessage = "Course updated successfully!";
        } else {
          response = await fetch("http://localhost:5000/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseToSave),
          });
          successMessage = "Course added successfully!";
        }
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Failed to save course");
        }
  
        if (isEditing) {
          setCourses(courses.map((course) => (course._id === editingCourseId ? data : course)));
        } else {
          setCourses([...courses, data]);
        }
  
        // Reset form and close modal
        setNewCourse({ _id: "", name: "", code: "", instructors: [], description: "", classIds: [], isActive: 1 });
        setSelectedClassIds([]);
        setModalOpen(false);
        setIsEditing(false);
        setEditingCourseId(null);
  
        // Show success toast
        toast.success(successMessage, { autoClose: 3000 });
      } catch (err: unknown) {
          console.error("Failed to save course:", (err as Error).message);
          toast.error(`${(err as Error).message}`, { autoClose: 5000 });
        console.error("Failed to save course:", err);
        toast.error("An unexpected error occurred.", { autoClose: 5000 });
      }
    } else {
      toast.warn("Please fill in all fields before saving.", { autoClose: 3000 });
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
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, { method: "DELETE" });
      
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
  
      setCourses(courses.filter((course) => course._id !== id));
      toast.success("Course deleted successfully!", { autoClose: 3000 });
  
    } catch (err: unknown) {
      console.error("Failed to delete course:", err);
      toast.error(`${(err as Error).message}`, { autoClose: 5000 });
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

  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  
  const handleSaveTeacherAssignments = async () => {
    try {
      // Filter out sections with no teacher assigned and create valid assignments
      const validAssignments = Object.entries(sectionAssignments)
        .filter(([teacherId]) => teacherId)
        .map(([sectionId, teacherId]) => {
          const section = sections.find(s => s._id === sectionId);
          if (!section) throw new Error(`Section ${sectionId} not found`);
          
          return {
            section: sectionId,
            teacher: teacherId,
            course: selectedCourseId,
            timeSlot: "None",
            className: classes.find(c => c._id === section.classID)?.className || "Unknown Class",
            sectionName: section.sectionName
          };
        });
  
      if (validAssignments.length === 0) {
        throw new Error("No valid assignments to save. Please assign teachers to sections.");
      }
  
      // Step 1: Save teacher assignments
      const assignmentResponse = await fetch("http://localhost:5000/api/teacher-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validAssignments),
      });
  
      if (!assignmentResponse.ok) throw new Error("Failed to save teacher assignments");
  
      // Step 2: Update course instructors with all unique assigned teachers
      const assignedTeacherIds = [...new Set(validAssignments.map(a => a.teacher))];
      const assignedTeachers = assignedTeacherIds.map(teacherId => {
        const teacher = teachers.find(t => t._id === teacherId);
        return teacher?.name || "Unknown Teacher";
      });
  
      const course = courses.find(c => c._id === selectedCourseId);
      if (!course) throw new Error("Course not found");
      
      const updatedCourse = { 
        ...course, 
        instructors: assignedTeachers,
        assignedSections: validAssignments.map(a => ({
          sectionId: a.section,
          sectionName: a.sectionName,
          className: a.className
        }))
      };
  
      // Step 3: Save updated course
      const courseResponse = await fetch(`http://localhost:5000/api/courses/${selectedCourseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse),
      });
  
      if (!courseResponse.ok) throw new Error("Failed to update course with assigned teachers");
  
      // Step 4: Update state
      const updatedCourseData = await courseResponse.json();
      setCourses(prevCourses =>
        prevCourses.map(c => (c._id === selectedCourseId ? updatedCourseData : c))
      );
  
      // Step 5: Reset modal and selections
      setAssignModalOpen(false);
      setSectionAssignments({});
      toast.success("Teachers assigned successfully!", { autoClose: 2000 });
  
    } catch (err) {
      toast.error(` ${(err as Error).message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
  
    }
  };
// Handler for assigning teachers to sections
const handleTeacherAssignment = (sectionId : string, teacherId: string) => {
  setSectionAssignments(prev => ({
    ...prev,
    [sectionId]: teacherId || undefined // Store undefined if teacherId is empty
  }));
};


// Add this handler function
const handleViewAssignments = async (courseId: string) => {
  setLoading(true); // Start loading
  try {
    const response = await fetch(`http://localhost:5000/api/teacher-assignments/${courseId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch assignment details");
    }
    
    const data: ICourseAssignment[] = await response.json(); // Expecting an array

    if (data.length > 0) {
      setAssignmentDetails(data);
      setAssignmentModalOpen(true);
    } else {
      console.warn("No assignments found for this course.");
      toast.info("No assignments found", { autoClose: 3000 });
    }
  } catch (err) {
    console.error("Error fetching assignments:", err);
    toast.error("Failed to load assignment details", { autoClose: 3000 });
  } finally {
    setLoading(false); // Stop loading
  }
};


return (
  <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
    <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Manage Courses</h3>
    <ToastContainer  theme="dark"/>
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
            <th className="p-3 border border-gray-700">Course Description</th>
            <th className="p-3 border border-gray-700">Assigned Classes</th>
            <th className="p-3 border border-gray-700">Unassigned Sections</th>
            <th className="p-3 border border-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
        {tableLoaing ? (
          <tr>
            <td colSpan={6}><TableLoadingSpinner /></td>
         </tr>
  
) : filteredCourses.length > 0 ? (
    filteredCourses.map((course) => (
      <tr key={course._id} className="border-b border-gray-700 hover:bg-gray-800">
        <td className="p-3">{course.code}</td>
        <td className="p-3">{course.name}</td>
        <td className="p-3">{course.description}</td>
        <td className="p-3">
          {course.classIds.length > 0
            ? course.classIds
                .map((classId) => classes.find((cls) => cls._id === classId)?.className)
                .join(", ")
            : "No classes assigned"}
        </td>
        <td className="p-3">
          {(course?.unassignedSectionNames?.length ?? 0) > 0
            ? course.unassignedSectionNames?.join(", ")
            : "No Unassigned exist"}
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
            Assign
          </button>
          <button
            className={`text-blue-400 hover:underline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleViewAssignments(course._id)}
            disabled={loading}
          >
            {loading ? "Loading..." : "View"}
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

    {/* Add Course button remains the same */}
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

    {/* Assignment Details Modal */}
    {assignmentModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md">
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-yellow-400 text-xl mb-4">Assignment Details</h2>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              <span className="text-gray-400 ml-2">Loading...</span>
            </div>
          ) : assignmentDetails.length > 0 ? (
            <div className="space-y-4">
              {assignmentDetails.map((assignment) => {
                const sectionName = assignment.sectionName;
                const teacherName = assignment.teacherName;
                const className = assignment.className;

                return (
                  <div key={assignment._id} className="border-b border-gray-700 pb-4 last:border-0">
                    <div className="text-white">
                      <span className="font-medium">{className || "Unknown Class"}</span>
                      <span> - Section {sectionName || "Unknown"}</span>
                    </div>
                    <div className="text-yellow-400 mt-1">
                      Teacher: {teacherName || "Unknown Teacher"}
                    </div>
                    {assignment.timeSlot && assignment.timeSlot !== "None" && (
                      <div className="text-gray-300 text-sm mt-1">
                        Time Slot: {assignment.timeSlot}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">No assignment details found</div>
          )}

          <div className="flex justify-end mt-6">
            <button className="text-gray-400 hover:underline" onClick={() => setAssignmentModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}

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
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
      <h2 className="text-yellow-400 text-xl mb-4">Assign Teachers to Sections</h2>

      {/* SECTION-TEACHER ASSIGNMENT */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section._id} className="border-b border-gray-700 pb-4 last:border-0">
            <div className="text-white font-medium mb-2">
              {`${classes.find((cls) => cls._id === section.classID)?.className || "Unknown Class"} - Section ${section.sectionName}`}
            </div>
            
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Assign Teacher:</label>
              <select
                value={sectionAssignments[section._id] || ""}
                onChange={(e) => handleTeacherAssignment(section._id, e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="text-gray-400 hover:underline"
          onClick={() => setAssignModalOpen(false)}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTeacherAssignments}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md"
          disabled={Object.keys(sectionAssignments).length === 0} // Disable if no assignments made
        >
          Save Assignments
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageCourses;