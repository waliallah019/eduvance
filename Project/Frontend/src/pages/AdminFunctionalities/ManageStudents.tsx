import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Section } from "../../interface/class.interface";

interface StudentResponse {
  data: {
    student: Student;
    user: {
      username: string;
      role: string;
    };
  };
  success: boolean;
  message: string;
}

interface Student {
  _id?: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  fatherCNIC: string;
  bFormNumberCNIC: string;
  dob: string;
  guardianContactNumber: string;
  guardianEmail: string;
  classId?: string; // Store the class ID separately
  className: string;
  section: string;
  address: string;
  gender: string;
  rollNumber: string;
  leavingCertificate?: File | string | null;
  characterCertificate?: File | string | null;
  leavingCertificatePath?: string;
  characterCertificatePath?: string;
  isActive?: number;
  username: string; // Added username
  password: string; // Added password
}

interface Class {
  _id: string;
  className: string;
  Session: string;
  TimeTable: string;
  HighScorers: string;
}

interface ClassResponse {
  data: Class[];
}

// API base URL
const API_URL = "http://localhost:5000/api/students";
const SECTION_API_URL = "http://localhost:5000/api/sections"; //Corrected route
const CLASS_API_URL = "http://localhost:5000/api/classes"; //Corrected route

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [newStudent, setNewStudent] = useState<Student>({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    fatherCNIC: "",
    bFormNumberCNIC: "",
    dob: "",
    guardianContactNumber: "",
    guardianEmail: "",
    className: "",
    section: "",
    address: "",
    gender: "",
    rollNumber: "",
    leavingCertificate: null,
    characterCertificate: null,
    username: "", // Added username
    password: "", // Added password,
    classId: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student>({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    fatherCNIC: "",
    bFormNumberCNIC: "",
    dob: "",
    guardianContactNumber: "",
    guardianEmail: "",
    className: "",
    section: "",
    address: "",
    gender: "",
    rollNumber: "",
    username: "", // Added username
    password: "", // Added password
    classId: "",
    leavingCertificate: null,
    characterCertificate: null,
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);

  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, [showInactive]);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response: AxiosResponse<ClassResponse> = await axios.get(
          CLASS_API_URL,
        );
        // Check if response.data is an array, otherwise set empty array
        console.log("Full API Response:", response.data);
        const classData = Array.isArray(response.data) ? response.data : [];
        console.log("classData", classData);
        setClasses(classData);
      } catch (error: any) {
        console.error("Error fetching classes:", error);
        setError(error.message || "Failed to load classes.");
      }
    };

    fetchClasses();
  }, []);

  // Fetch sections based on selected class
  useEffect(() => {
    const fetchSections = async () => {
      if (newStudent.classId) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/sections",
            {
              classIds: [newStudent.classId], // Ensure this is an array
            },
          );
          setSections(response.data);
        } catch (error: any) {
          console.error("Error fetching sections:", error);
          setError(
            error.message || "Failed to load sections. Please try again.",
          );
        }
      } else {
        setSections([]); // Clear sections if no class is selected
      }
    };

    fetchSections();
  }, [newStudent.classId]); // Use classId as the dependency

  // Fetch sections when editing student's class changes
  useEffect(() => {
    if (editModalOpen && editingStudent.className) {
      fetchSectionsForClass(editingStudent.className);
    }
  }, [editingStudent.className, editModalOpen]);
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const endpoint = showInactive ? `${API_URL}/inactive` : API_URL;
      const response: AxiosResponse<any> = await axios.get(endpoint);

      let studentsArray: any[] = [];

      if (Array.isArray(response.data)) {
        studentsArray = response.data;
      } else if (response.data && typeof response.data === "object") {
        const data = response.data as {
          students?: any[];
          data?: any[];
          results?: any[];
          items?: any[];
          [key: string]: any;
        };

        if (Array.isArray(data.students)) {
          studentsArray = data.students;
        } else if (Array.isArray(data.data)) {
          studentsArray = data.data;
        } else if (Array.isArray(data.results)) {
          studentsArray = data.results;
        } else if (Array.isArray(data.items)) {
          studentsArray = data.items;
        } else {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              studentsArray = data[key];
              break;
            }
          }
        }
      }

      console.log("Students array to map:", studentsArray);

      if (studentsArray.length > 0) {
        const mappedStudents = studentsArray.map((student: any) => ({
          _id: student._id,
          firstName: student.firstName || "", // Provide default value
          lastName: student.lastName,
          fatherName: student.fatherName,
          motherName: student.motherName,
          fatherCNIC: student.fatherCNIC,
          bFormNumberCNIC: student.bFormNumberCNIC,
          dob: student.dob,
          guardianContactNumber: student.guardianContactNumber,
          guardianEmail: student.guardianEmail,
          className: student.ClassName,
          section: student.section,
          address: student.address,
          gender: student.gender,
          rollNumber: student.rollNumber || "", // Provide default value
          leavingCertificatePath: student.leavingCertificate,
          characterCertificatePath: student.characterCertificate,
          isActive: student.isActive,
          username: student.username || "", // Provide default value
          password: student.password || "", // Provide default value
          classId: student.classId || "",
        }));
        setStudents(mappedStudents);
      } else {
        console.warn("No student array found in response");
        setStudents([]);
      }

      setError(null);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const firstName = student.firstName || "";
    const rollNumber = student.rollNumber || "";

    const studentClassName = (student.className || "").trim().toLowerCase(); // Normalize student's class name
    const selectedClassLower = selectedClass.trim().toLowerCase(); // Normalize selected class

    return (
      (selectedClass === "All" || studentClassName === selectedClassLower) &&
      (firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rollNumber.includes(searchQuery))
    );
  });


  // Handle certificate file change for new student
  const handleCharacterCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setNewStudent((prev) => ({ ...prev, characterCertificate: file }));
  };

  // Handle leaving certificate file change for new student
  const handleLeavingCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setNewStudent((prev) => ({ ...prev, leavingCertificate: file }));
  };

  // Handle certificate file change for editing student
  const handleEditCharacterCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setEditingStudent((prev) => ({ ...prev, characterCertificate: file }));
  };

  // Handle leaving certificate file change for editing student
  const handleEditLeavingCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setEditingStudent((prev) => ({ ...prev, leavingCertificate: file }));
  };

  // Add new student

  const handleAddStudent = async () => {
    if (
      newStudent.firstName &&
      newStudent.lastName &&
      newStudent.fatherName &&
      newStudent.motherName &&
      newStudent.fatherCNIC &&
      newStudent.bFormNumberCNIC &&
      newStudent.dob &&
      newStudent.guardianContactNumber &&
      newStudent.className &&
      newStudent.section &&
      newStudent.address &&
      newStudent.gender &&
      newStudent.username && // Validate username
      newStudent.password &&
      newStudent.classId
    ) {
      try {
        setIsAddingStudent(true);
        // Create FormData for file uploads
        const formData = new FormData();
        // Append all student data
        formData.append("firstName", newStudent.firstName);
        formData.append("lastName", newStudent.lastName);
        formData.append("fatherName", newStudent.fatherName);
        formData.append("motherName", newStudent.motherName);
        formData.append("fatherCNIC", newStudent.fatherCNIC);
        formData.append("bFormNumberCNIC", newStudent.bFormNumberCNIC);
        formData.append("dob", newStudent.dob);
        formData.append(
          "guardianContactNumber",
          newStudent.guardianContactNumber,
        );
        formData.append("guardianEmail", newStudent.guardianEmail || "");
        formData.append("className", newStudent.className);
        formData.append("classId", newStudent.classId || "");
        formData.append("section", newStudent.section);
        formData.append("address", newStudent.address);
        formData.append("gender", newStudent.gender);
        formData.append("isActive", "1"); // Explicitly set as active
        formData.append("username", newStudent.username); // Add username
        formData.append("password", newStudent.password); // Add password

        // Append files if they exist
        if (newStudent.leavingCertificate instanceof File) {
          console.log(
            "Leaving certificate file:",
            newStudent.leavingCertificate,
          );
          formData.append("leavingCertificate", newStudent.leavingCertificate);
        }
        if (newStudent.characterCertificate instanceof File) {
          console.log(
            "Character certificate file:",
            newStudent.characterCertificate,
          );
          formData.append(
            "characterCertificate",
            newStudent.characterCertificate,
          );
        }
        console.log(formData);

        // Explicitly type the AxiosResponse here
        const response: AxiosResponse<StudentResponse> = await axios.post(
          API_URL,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // Add the new student to the list if we're viewing active students
        if (!showInactive) {
          const newStudent = response.data?.data?.student; // Use the StudentResponse type
          console.log("newStudent", newStudent);
          if (newStudent) {
            setStudents((prev) => [newStudent, ...prev]);
          } else {
            console.warn("Student data not found in response:", response.data);
          }
        }

        // Reset form
        setNewStudent({
          firstName: "",
          lastName: "",
          fatherName: "",
          motherName: "",
          fatherCNIC: "",
          bFormNumberCNIC: "",
          dob: "",
          guardianContactNumber: "",
          guardianEmail: "",
          className: "",
          section: "",
          address: "",
          gender: "",
          rollNumber: "",
          leavingCertificate: null,
          characterCertificate: null,
          username: "", // Added username
          password: "", // Added password,
          classId: "",
        });

        setModalOpen(false);
      } catch (err: any) {
        console.log("Error adding student:", err);
        console.log("Full error object:", err);
        console.log("Error response:", err.response);
        console.log("Error status:", err.response?.status);
        console.log("Error data:", err.response?.data);

        alert(
          err.response?.data?.error ||
            "Failed to add student. Please try again.",
        );
      } finally {
        setIsAddingStudent(false);
      }
    } else {
      alert("Please fill all required fields before adding a student.");
    }
  };

  // Soft Delete student (mark as inactive)
  const handleDeleteStudent = async (id: string) => {
    console.log("Deleting student with ID:", id); // Log the ID
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/${id}`); // Correct URL: API_URL/studentId
        setStudents(students.filter((student) => student._id !== id));
      } catch (err: any) {
        console.error("Error deleting student:", err);
        console.error("Error in deleteStudent:", error);

        console.log("Full error object:", err);
        console.log("Error response:", err.response);
        console.log("Error status:", err.response?.status);
        console.log("Error data:", err.response?.data);
        alert("Failed to delete student. Please try again.");
      }
    }
  };
  const fetchSectionsForClass = async (classId: string) => {
    if (classId) {
      try {
        const response: AxiosResponse<{ data: Section[] }> = await axios.get(
          `${SECTION_API_URL}/class/${classId}`,
        );
        setSections(response.data.data);
      } catch (error: any) {
        console.error("Error fetching sections:", error);
        setError(
          error.message || "Failed to load sections. Please try again.",
        );
      }
    } else {
      setSections([]); // Clear sections if no class is selected
    }
  };
  // Edit student
  const handleEditClick = (student: Student) => {
    console.log("Editing student:", student);
    setEditingStudent({
      ...student,
      leavingCertificate: student.leavingCertificatePath || null,
      characterCertificate: student.characterCertificatePath || null,
      classId: student.classId || "", // Add this line!
    });
    fetchSectionsForClass(student.classId!);
    setEditModalOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent._id) return;

    if (
      editingStudent.firstName &&
      editingStudent.lastName &&
      editingStudent.fatherName &&
      editingStudent.motherName &&
      editingStudent.fatherCNIC &&
      editingStudent.bFormNumberCNIC &&
      editingStudent.dob &&
      editingStudent.guardianContactNumber &&
      editingStudent.className &&
      editingStudent.section &&
      editingStudent.address &&
      editingStudent.gender
    ) {
      try {
        // Create FormData for file uploads
        const formData = new FormData();

        // Append all student data
        formData.append("firstName", editingStudent.firstName);
        formData.append("lastName", editingStudent.lastName);
        formData.append("fatherName", editingStudent.fatherName);
        formData.append("motherName", editingStudent.motherName);
        formData.append("fatherCNIC", editingStudent.fatherCNIC);
        formData.append("bFormNumberCNIC", editingStudent.bFormNumberCNIC);
        formData.append("dob", editingStudent.dob);
        formData.append(
          "guardianContactNumber",
          editingStudent.guardianContactNumber,
        );
        formData.append("guardianEmail", editingStudent.guardianEmail || "");
        formData.append("className", editingStudent.className);
        formData.append("section", editingStudent.section);
        formData.append("address", editingStudent.address);
        formData.append("gender", editingStudent.gender);

        // Append files if they exist and are File objects
        if (editingStudent.leavingCertificate instanceof File) {
          formData.append(
            "leavingCertificate",
            editingStudent.leavingCertificate,
          );
        }
        if (editingStudent.characterCertificate instanceof File) {
          formData.append(
            "characterCertificate",
            editingStudent.characterCertificate,
          );
        }

        const response: AxiosResponse<Student> = await axios.put(
          `${API_URL}/${editingStudent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // Update the student in the list
        setStudents(
          students.map((student) =>
            student._id === editingStudent._id ? response.data : student,
          ),
        );

        setEditModalOpen(false);
      } catch (err: any) {
        console.error("Error updating student:", err);
        alert(
          err.response?.data?.error ||
            "Failed to update student. Please try again.",
        );
      }
    } else {
      alert("Please fill all required fields before updating a student.");
    }
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">
        Manage Students
      </h3>

      {/* Loading and Error Messages */}
      {loading && <p className="text-center text-white">Loading students...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

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
  value={selectedClass} // Use selectedClass here
  onChange={(e) => {
    setSelectedClass(e.target.value); // Update the selectedClass state
  }}
>
  <option value="All">All</option> {/* Changed value to "All" */}
  {classes.map((cls) => (
    <option key={cls._id} value={cls.className}>
      {cls.className}
    </option>
  ))}
</select>

      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Roll No.</th>
              <th className="p-3 border border-gray-700">First Name</th>
              <th className="p-3 border border-gray-700">Last Name</th>
              <th className="p-3 border border-gray-700">Class</th>
              <th className="p-3 border border-gray-700">Section</th>
              <th className="p-3 border border-gray-700">Father Name</th>
              <th className="p-3 border border-gray-700">Mother Name</th>
              <th className="p-3 border border-gray-700">B-Form/CNIC</th>
              <th className="p-3 border border-gray-700">Gender</th>
              <th className="p-3 border border-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr
                  key={student._id || `student-${index}`}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">{student.rollNumber}</td>
                  <td className="p-3">{student.firstName}</td>
                  <td className="p-3">{student.lastName}</td>
                  <td className="p-3">{student.className}</td>
                  <td className="p-3">{student.section}</td>
                  <td className="p-3">{student.fatherName}</td>
                  <td className="p-3">{student.motherName}</td>
                  <td className="p-3">{student.bFormNumberCNIC}</td>
                  <td className="p-3">{student.gender}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteStudent(student._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center p-4 text-gray-400"
                >
                  No students found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Add Student Button */}
      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
          disabled={isAddingStudent}
        >
          {isAddingStudent ? "Adding Student..." : "+ Add Student"}
        </button>
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-yellow-400 text-xl mb-4">Add New Student</h2>

            {/* Username Field */}
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.username}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  username: e.target.value,
                })
              }
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.password}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  password: e.target.value,
                })
              }
            />

            {/* First Name Field */}
            <input
              type="text"
              placeholder="First Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.firstName}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  firstName: e.target.value,
                })
              }
            />

            {/* Last Name Field */}
            <input
              type="text"
              placeholder="Last Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.lastName}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  lastName: e.target.value,
                })
              }
            />

            {/* Father Name Field */}
            <input
              type="text"
              placeholder="Father Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.fatherName}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  fatherName: e.target.value,
                })
              }
            />

            {/* Mother Name Field */}
            <input
              type="text"
              placeholder="Mother Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.motherName}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  motherName: e.target.value,
                })
              }
            />

            {/* B-Form / CNIC Field */}
            <input
              type="text"
              placeholder="B-Form / CNIC"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.bFormNumberCNIC}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  bFormNumberCNIC: e.target.value,
                })
              }
            />

            {/* Date of Birth Field */}
            <input
              type="date"
              placeholder="Date of Birth"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.dob}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  dob: e.target.value,
                })
              }
            />

            {/* Class Dropdown */}
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.classId}
              onChange={(e) => {
                const selectedClass = classes.find(
                  (cls) => cls._id === e.target.value,
                );
                setNewStudent({
                  ...newStudent,
                  classId: e.target.value,
                  className: selectedClass ? selectedClass.className : "", // Use lowercase className
                  section: "", // Reset section when class changes
                });
              }}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                  {/* Use lowercase className */}
                </option>
              ))}
            </select>
            {/* Section Dropdown */}
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.section}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  section: e.target.value,
                })
              }
            >
              <option value="">Select Section</option>
              {sections?.length > 0 ? (
                sections.map((section, index) => (
                  <option
                    key={section._id || `section-add-${index}`}
                    value={section.sectionName}
                  >
                    {section.sectionName}
                  </option>
                ))
              ) : (
                <option disabled>No sections available</option>
              )}
            </select>

            {/* Father CNIC Field */}
            <input
              type="text"
              placeholder="Father CNIC"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.fatherCNIC}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  fatherCNIC: e.target.value,
                })
              }
            />

            {/* Guardian Email Field */}
            <input
              type="email"
              placeholder="Guardian Email"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.guardianEmail}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  guardianEmail: e.target.value,
                })
              }
            />

            {/* Guardian Contact Field */}
            <input
              type="text"
              placeholder="Guardian Contact"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.guardianContactNumber}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  guardianContactNumber: e.target.value,
                })
              }
            />

            {/* Address Field */}
            <input
              type="text"
              placeholder="Address"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.address}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  address: e.target.value,
                })
              }
            />

            {/* Leaving School Certificate Upload */}
            <div className="mb-3">
              <label className="text-white block mb-1">
                Leaving School Certificate:
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                onChange={handleLeavingCertificateChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload PDF or image file
              </p>
            </div>

            {/* Character Certificate Upload */}
            <div className="mb-3">
              <label className="text-white block mb-1">
                Character Certificate:
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                onChange={handleCharacterCertificateChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload PDF or image file
              </p>
            </div>

            {/* Gender Dropdown */}
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newStudent.gender}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-gray-400 hover:underline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium w-full"
                onClick={handleAddStudent}
                disabled={isAddingStudent}
              >
                {isAddingStudent ? "Adding Student..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-yellow-400 text-xl mb-4">Edit Student</h2>

            <input
              type="text"
              placeholder="First Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.firstName}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  firstName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.lastName}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  lastName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Father Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.fatherName}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  fatherName: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Mother Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.motherName}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  motherName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="B-Form / CNIC"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.bFormNumberCNIC}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  bFormNumberCNIC: e.target.value,
                })
              }
            />

            <input
              type="date"
              placeholder="Date of Birth"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.dob}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  dob: e.target.value,
                })
              }
            />

            {/* Class Dropdown */}
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.classId}
              onChange={(e) => {
                const selectedClass = classes.find(
                  (cls) => cls._id === e.target.value,
                );
                setEditingStudent({
                  ...editingStudent,
                  classId: e.target.value,
                  className: selectedClass ? selectedClass.className : "",
                  section: "",
                });
                fetchSectionsForClass(e.target.value);
              }}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>

            {/* Section Dropdown */}
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.section}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  section: e.target.value,
                })
              }
            >
              <option value="">Select Section</option>
              {sections.map((section, index) => (
                <option
                  key={section._id || `section-edit-${index}`}
                  value={section.sectionName}
                >
                  {section.sectionName}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Father CNIC"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.fatherCNIC}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  fatherCNIC: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Guardian Email"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.guardianEmail}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  guardianEmail: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Guardian Contact"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.guardianContactNumber}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  guardianContactNumber: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.address}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  address: e.target.value,
                })
              }
            />

            {/* Upload Leaving School Certificate - Display Filename */ }
            <div className="mb-3">
              <label className="text-white block mb-1">
                Leaving School Certificate:
              </label>
              {editingStudent.leavingCertificatePath ? (
                <p className="text-gray-400">
                  Current File: {editingStudent.leavingCertificatePath}
                </p>
              ) : null}
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                onChange={handleEditLeavingCertificateChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload PDF or image file
              </p>
            </div>

            {/* Character Certificate - Display Filename */ }
            <div className="mb-3">
              <label className="text-white block mb-1">
                Character Certificate:
              </label>
              {editingStudent.characterCertificatePath ? (
                <p className="text-gray-400">
                  Current File: {editingStudent.characterCertificatePath}
                </p>
              ) : null}
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                onChange={handleEditCharacterCertificateChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload PDF or image file
              </p>
            </div>

            <select
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={editingStudent.gender}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-gray-400 hover:underline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium w-full"
                onClick={handleUpdateStudent}
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
