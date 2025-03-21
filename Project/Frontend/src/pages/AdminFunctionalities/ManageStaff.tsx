import { useState } from "react";

interface Staff {
  id: number;
  name: string;
  staffId: string;
  type: "teaching" | "non-teaching";
  role: string;
  department: string;
  contactNumber: string;
  email: string;
  joiningDate: string;
}

const ManageStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>([
    { 
      id: 1, 
      name: "Dr. Sarah Wilson", 
      staffId: "TCH001", 
      type: "teaching",
      role: "Senior Teacher",
      department: "Science",
      contactNumber: "123-456-7890",
      email: "sarah.wilson@school.com",
      joiningDate: "2023-01-15"
    },
    { 
      id: 2, 
      name: "John Davis", 
      staffId: "NTS001", 
      type: "non-teaching",
      role: "Librarian",
      department: "Library",
      contactNumber: "123-456-7891",
      email: "john.davis@school.com",
      joiningDate: "2023-02-20"
    }
  ]);

  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [newStaff, setNewStaff] = useState<Staff>({
    id: 0,
    name: "",
    staffId: "",
    type: "teaching",
    role: "",
    department: "",
    contactNumber: "",
    email: "",
    joiningDate: ""
  });

  const [editingStaff, setEditingStaff] = useState<Staff>({
    id: 0,
    name: "",
    staffId: "",
    type: "teaching",
    role: "",
    department: "",
    contactNumber: "",
    email: "",
    joiningDate: ""
  });

  const departments = ["All", "Science", "Mathematics", "English", "History", "Library", "Administration", "Maintenance"];
  const staffTypes = ["All", "teaching", "non-teaching"];
  
  const teachingRoles = ["Teacher", "Senior Teacher", "Head of Department", "Coordinator"];
  const nonTeachingRoles = ["Librarian", "Administrator", "Maintenance Staff", "Lab Assistant", "Clerk"];

  // Filter staff
  const filteredStaff = staffList.filter(staff =>
    (selectedType === "All" || staff.type === selectedType) &&
    (selectedDepartment === "All" || staff.department === selectedDepartment) &&
    (staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     staff.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
     staff.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add new staff
  const handleAddStaff = () => {
    if (newStaff.name && newStaff.staffId && newStaff.department && newStaff.role) {
      setStaffList([...staffList, { ...newStaff, id: staffList.length + 1 }]);
      setNewStaff({
        id: 0,
        name: "",
        staffId: "",
        type: "teaching",
        role: "",
        department: "",
        contactNumber: "",
        email: "",
        joiningDate: ""
      });
      setModalOpen(false);
    }
  };

  // Delete staff
  const handleDeleteStaff = (id: number) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  // Edit staff
  const handleEditClick = (staff: Staff) => {
    setEditingStaff(staff);
    setEditModalOpen(true);
  };

  const handleUpdateStaff = () => {
    if (editingStaff.name && editingStaff.staffId && editingStaff.department && editingStaff.role) {
      setStaffList(staffList.map(staff => 
        staff.id === editingStaff.id ? editingStaff : staff
      ));
      setEditModalOpen(false);
    }
  };

  const StaffForm = ({ staff, setStaff, onSubmit, onCancel, submitLabel }: any) => (
    <div className="space-y-2">
      <input 
        type="text"
        placeholder="Staff Name"
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.name}
        onChange={(e) => setStaff({ ...staff, name: e.target.value })}
      />
      <input 
        type="text"
        placeholder="Staff ID"
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.staffId}
        onChange={(e) => setStaff({ ...staff, staffId: e.target.value })}
      />
      <select 
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.type}
        onChange={(e) => setStaff({ ...staff, type: e.target.value as "teaching" | "non-teaching", role: "" })}
      >
        <option value="teaching">Teaching Staff</option>
        <option value="non-teaching">Non-Teaching Staff</option>
      </select>
      <select 
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.role}
        onChange={(e) => setStaff({ ...staff, role: e.target.value })}
      >
        <option value="">Select Role</option>
        {staff.type === "teaching" 
          ? teachingRoles.map(role => <option key={role} value={role}>{role}</option>)
          : nonTeachingRoles.map(role => <option key={role} value={role}>{role}</option>)
        }
      </select>
      <select 
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.department}
        onChange={(e) => setStaff({ ...staff, department: e.target.value })}
      >
        <option value="">Select Department</option>
        {departments.slice(1).map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <input 
        type="tel"
        placeholder="Contact Number"
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.contactNumber}
        onChange={(e) => setStaff({ ...staff, contactNumber: e.target.value })}
      />
      <input 
        type="email"
        placeholder="Email"
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.email}
        onChange={(e) => setStaff({ ...staff, email: e.target.value })}
      />
      <input 
        type="date"
        placeholder="Joining Date"
        className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        value={staff.joiningDate}
        onChange={(e) => setStaff({ ...staff, joiningDate: e.target.value })}
      />
      <div className="flex justify-end gap-3 mt-4">
        <button 
          className="text-gray-400 hover:underline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          onClick={onSubmit} 
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-normal"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Manage Staff</h3>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by name, ID or email"
          className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {staffTypes.map(type => (
            <option key={type} value={type}>{type === "All" ? "All Staff" : `${type.charAt(0).toUpperCase() + type.slice(1)} Staff`}</option>
          ))}
        </select>

        <select 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Staff List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Staff ID</th>
              <th className="p-3 border border-gray-700">Name</th>
              <th className="p-3 border border-gray-700">Type</th>
              <th className="p-3 border border-gray-700">Role</th>
              <th className="p-3 border border-gray-700">Department</th>
              <th className="p-3 border border-gray-700">Contact</th>
              <th className="p-3 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map(staff => (
                <tr key={staff.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{staff.staffId}</td>
                  <td className="p-3">{staff.name}</td>
                  <td className="p-3 capitalize">{staff.type}</td>
                  <td className="p-3">{staff.role}</td>
                  <td className="p-3">{staff.department}</td>
                  <td className="p-3">{staff.contactNumber}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button 
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditClick(staff)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-400">No staff found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Button */}
      <div className="mt-6">
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
        >
          + Add Staff
        </button>
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">Add New Staff</h2>
            <StaffForm 
              staff={newStaff}
              setStaff={setNewStaff}
              onSubmit={handleAddStaff}
              onCancel={() => setModalOpen(false)}
              submitLabel="Add Staff"
            />
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">Edit Staff</h2>
            <StaffForm 
              staff={editingStaff}
              setStaff={setEditingStaff}
              onSubmit={handleUpdateStaff}
              onCancel={() => setEditModalOpen(false)}
              submitLabel="Update Staff"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;