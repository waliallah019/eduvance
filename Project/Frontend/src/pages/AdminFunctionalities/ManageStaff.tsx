/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useCallback,
  memo,
  useEffect,
} from "react";
import axios from "axios";
import { TeacherStaff, ApiError } from "../../interface/TeacherStaff";
import React from "react";

const ManageTeachers = () => {
  const [activeTab, setActiveTab] =
    useState<"teaching" | "non-teaching">("teaching");
  const [staffList, setStaffList] = useState<TeacherStaff[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const initialStaffState: TeacherStaff = {
    _id: "",
    id: 0, // Changed to a number. The default value is set to 0.
    name: "",
    cnic: "",
    dob: "",
    contactNumber: "",
    email: "",
    employeeNumber: "",
    experience: "",
    salary: 0,
    employmentType: "Full-time",
    department: "",
    joiningDate: "",
    timeSlotStart: "", // Initialize timeSlotStart
    timeSlotEnd: "", // Initialize timeSlotEnd
    documents: {
      resume: null,
      cnicCopy: null,
      educationCertificates: null,
      experienceCertificates: null,
      recentPhoto: null,
    },
    type: "teaching",
    role: "",
    user: "", // Initialize user
  };

  const [newStaff, setNewStaff] = useState<TeacherStaff>(
    JSON.parse(JSON.stringify(initialStaffState)),
  );

  const [editingStaff, setEditingStaff] = useState<TeacherStaff>(
    JSON.parse(JSON.stringify(initialStaffState)),
  );

  const departments = [
    "All",
    "Science",
    "Mathematics",
    "English",
    "History",
    "Library",
    "Administration",
    "Maintenance",
  ];
  const teachingRoles = [
    "Teacher",
    "Senior Teacher",
    "Head of Department",
    "Coordinator",
  ];
  const nonTeachingRoles = [
    "Librarian",
    "Administrator",
    "Maintenance Staff",
    "Lab Assistant",
    "Clerk",
  ];
  const employmentTypes = ["Full-time", "Part-time", "Contract"];

  const generateEmployeeNumber = useCallback(
    (type: "teaching" | "non-teaching") => {
      const prefix = type === "teaching" ? "TCH" : "NTS";
      const teachingCount = staffList.filter((s) => s.type === type).length;
      const paddedNumber = String(teachingCount + 1).padStart(3, "0");
      return `${prefix}${paddedNumber}`;
    },
    [staffList],
  );

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<TeacherStaff[]>(
        "http://localhost:5000/api/staff",
      );
      setStaffList(
        res.data.map((staff) => ({
          ...staff,
          id: parseInt(staff._id), // Convert _id to a number and assign to id
        })),
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch staff");
      console.error(err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [activeTab, selectedDepartment, searchQuery, fetchStaff]);

  const handleAddStaff = useCallback(
    async (staffData: TeacherStaff) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const employeeNumber = generateEmployeeNumber(staffData.type);
        const formData = new FormData();

        for (const key in staffData) {
          if (key === "documents") {
            if (staffData.documents) {
              for (const docKey in staffData.documents) {
                if (
                  staffData.documents[docKey as keyof typeof staffData.documents]
                ) {
                  formData.append(
                    docKey,
                    staffData.documents[
                      docKey as keyof typeof staffData.documents
                    ] as unknown as File,
                  );
                }
              }
            }
          } else {
            formData.append(key, (staffData as any)[key]);
          }
        }
        formData.append("employeeNumber", employeeNumber);
        formData.append("username", username);
        formData.append("password", password);

        const response = await axios.post(
          "http://localhost:5000/api/staff",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          const createdStaff: TeacherStaff = response.data as TeacherStaff;
          setStaffList((prevList) => [...prevList, createdStaff]);
          setNewStaff(JSON.parse(JSON.stringify(initialStaffState)));
          setModalOpen(false);
          setUsername("");
          setPassword("");
        } else {
          setError("Failed to add staff");
          console.error("Failed to add staff:", response.statusText);
        }
      } catch (err: any) {
        const apiError: ApiError = err.response?.data;

        if (apiError.errors) {
          setError(apiError.errors.map((e) => e.msg).join(", "));
        } else {
          setError(apiError.message || "Failed to add staff");
        }
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [generateEmployeeNumber, initialStaffState, password, setModalOpen, setStaffList, setUsername, username],
  );

  const handleDeleteStaff = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:5000/api/staff/${id}`);
        setStaffList((prevList) => prevList.filter((staff) => staff._id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete staff");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleEditClick = useCallback((staff: TeacherStaff) => {
    setEditingStaff(JSON.parse(JSON.stringify(staff)));
    setEditModalOpen(true);
  }, []);

  const handleUpdateStaff = useCallback(
    async (staffData: TeacherStaff) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const formData = new FormData();

        for (const key in staffData) {
          if (key === "documents") {
            if (staffData.documents) {
              for (const docKey in staffData.documents) {
                if (
                  staffData.documents[docKey as keyof typeof staffData.documents]
                ) {
                  formData.append(
                    docKey,
                    staffData.documents[
                      docKey as keyof typeof staffData.documents
                    ] as unknown as File,
                  );
                }
              }
            }
          } else {
            formData.append(key, (staffData as any)[key]);
          }
        }
        //CHANGE: pass the staffData._id instead of staffData.id here
        const response = await axios.put(
          `http://localhost:5000/api/staff/${staffData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          fetchStaff();
          setEditModalOpen(false);
        } else {
          setError("Failed to update staff");
          console.error("Failed to update staff:", response.statusText);
        }
      } catch (err: any) {
        const apiError: ApiError = err.response?.data;

        if (apiError.errors) {
          setError(apiError.errors.map((e) => e.msg).join(", "));
        } else {
          setError(apiError.message || "Failed to update staff");
        }
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchStaff, setEditModalOpen],
  );

  const StaffForm = memo(
    ({ staff, setStaff, onSubmit, onCancel, submitLabel, staffType }: any) => {
      const [localStaff, setLocalStaff] = useState(staff);

      useEffect(() => {
        setLocalStaff(staff);
      }, [staff]);

      const handleDocumentChange = useCallback(
        (doc: keyof TeacherStaff["documents"], file: File | null) => {
          setLocalStaff((prevStaff: TeacherStaff) => ({
            ...prevStaff,
            documents: {
              ...prevStaff.documents,
              [doc]: file,
            },
          }));
        },
        [],
      );

      const DocumentUploads = () => (
        <div className="mt-4">
          <h4 className="text-sm text-gray-400 mb-2">Upload Documents</h4>
          <div className="space-y-2">
            {Object.keys(localStaff.documents).map((key) => (
              <div key={key}>
                <label
                  htmlFor={`upload-${key}`}
                  className="block text-white text-sm font-bold mb-2"
                >
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) =>
                    str.toUpperCase(),
                  )}
                </label>
                <input
                  type="file"
                  id={`upload-${key}`}
                  className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md w-full"
                  onChange={(e) =>
                    handleDocumentChange(
                      key as keyof TeacherStaff["documents"],
                      e.target.files ? e.target.files[0] : null,
                    )
                  }
                />
                {localStaff.documents[
                  key as keyof TeacherStaff["documents"]
                ] && (
                    <p className="text-green-500 text-xs mt-1">
                      File uploaded:{" "}
                      {(
                        localStaff.documents[
                          key as keyof TeacherStaff["documents"]
                        ] as File
                      ).name}
                    </p>
                  )}
              </div>
            ))}
          </div>
        </div>
      );

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          setLocalStaff((prevStaff: TeacherStaff) => ({
            ...prevStaff,
            [name]: value,
          }));
        },
        [],
      );

      const handleSubmit = () => {
        setStaff(localStaff);
        onSubmit(localStaff); // Pass the staff data to onSubmit
      };

      return (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="name"
            value={localStaff.name}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="CNIC (e.g., 34201-1234567-8)"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="cnic"
            value={localStaff.cnic}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Date of Birth</label>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                name="dob"
                value={localStaff.dob}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Joining Date</label>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                name="joiningDate"
                value={localStaff.joiningDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Experience (e.g., 5 years)"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="experience"
            value={localStaff.experience}
            onChange={handleChange}
          />
          <input
            type="tel"
            placeholder="Contact Number"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="contactNumber"
            value={localStaff.contactNumber}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="email"
            value={localStaff.email}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Salary"
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="salary"
            value={localStaff.salary || ""}
            onChange={(e) =>
              setLocalStaff((prevStaff: TeacherStaff) => ({
                ...prevStaff,
                salary: parseInt(e.target.value) || 0,
              }))
            }
          />
          <select
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="employmentType"
            value={localStaff.employmentType}
            onChange={handleChange}
          >
            <option value="">Select Employment Type</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="role"
            value={localStaff.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            {staffType === "teaching"
              ? teachingRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))
              : nonTeachingRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
          </select>
          <select
            className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
            name="department"
            value={localStaff.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.slice(1).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Time Slot Start</label>
              <input
                type="time"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                name="timeSlotStart"
                value={localStaff.timeSlotStart}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-400">Time Slot End</label>
              <input
                type="time"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                name="timeSlotEnd"
                value={localStaff.timeSlotEnd}
                onChange={handleChange}
              />
            </div>
          </div>

          <DocumentUploads />

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="text-gray-400 hover:underline"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-yellow-400 text-black px-4 py-2 rounded-md font-normal"
              type="button"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      );
    },
  );

  const loadingStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    color: "white",
    zIndex: 1000,
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      {isSubmitting && <div style={loadingStyle}>Adding Staff...</div>}

      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">
        Manage School Staff
      </h3>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 p-1 rounded-lg flex">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "teaching"
                ? "bg-yellow-400 text-black"
                : "text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("teaching")}
          >
            Teaching Staff
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "non-teaching"
                ? "bg-yellow-400 text-black"
                : "text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("non-teaching")}
          >
            Non-Teaching Staff
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, ID, CNIC or email"
          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Employee ID</th>
              <th className="p-3 border border-gray-700">Name</th>
              <th className="p-3 border border-gray-700">CNIC</th>
              <th className="p-3 border border-gray-700">Role</th>
              <th className="p-3 border border-gray-700">Experience</th>
              <th className="p-3 border border-gray-700">Department</th>
              <th className="p-3 border border-gray-700">Salary</th>
              <th className="p-3 border border-gray-700">Time Slot</th>
              <th className="p-3 border border-gray-700">Documents</th>
              <th className="p-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr
                  key={staff._id}
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">{staff.employeeNumber}</td>
                  <td className="p-3">{staff.name}</td>
                  <td className="p-3">{staff.cnic}</td>
                  <td className="p-3">{staff.role}</td>
                  <td className="p-3">{staff.experience}</td>
                  <td className="p-3">{staff.department}</td>
                  <td className="p-3">{staff.salary.toLocaleString()}</td>
                  <td className="p-3">
                    {staff.timeSlotStart} - {staff.timeSlotEnd}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      {Object.entries(staff.documents).map(([key, value]) => (
                        <span
                          key={key}
                          className={`h-2 w-2 rounded-full ${
                            value ? "bg-green-500" : "bg-red-500"
                          }`}
                          title={key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        ></span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditClick(staff)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteStaff(staff._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-400">
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setNewStaff((prev) => ({
              ...prev,
              ...initialStaffState, // Reset to initial state
              type: activeTab,
            }));
            setModalOpen(true);
          }}
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
        >
          + Add {activeTab === "teaching" ? "Teacher" : "Staff"}
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-yellow-400 text-xl mb-4">
                Add New {newStaff.type === "teaching" ? "Teacher" : "Staff"}
              </h2>

              <input
                type="text"
                placeholder="Username"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
              <StaffForm
                staff={newStaff}
                setStaff={setNewStaff}
                onSubmit={handleAddStaff}
                onCancel={() => setModalOpen(false)}
                submitLabel={`Add ${
                  newStaff.type === "teaching" ? "Teacher" : "Staff"
                }`}
                staffType={newStaff.type}
              />
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-yellow-400 text-xl mb-4">
                Edit {editingStaff.type === "teaching" ? "Teacher" : "Staff"}
              </h2>
            </div>
            <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
              <StaffForm
                staff={editingStaff}
                setStaff={setEditingStaff}
                onSubmit={handleUpdateStaff}
                onCancel={() => setEditModalOpen(false)}
                submitLabel="Update"
                staffType={editingStaff.type}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;
