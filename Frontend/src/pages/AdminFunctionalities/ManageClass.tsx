import { useState, useEffect } from "react";

interface Class {
  _id: string;
  className: string;
  session: string;
  sections: string[];
  strengthBoys: number;
  strengthGirls: number;
  isActive: number;
}

const ManageClass = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [newClass, setNewClass] = useState<Class>({
    _id: "",
    className: "",
    session: "",
    sections: [""],
    strengthBoys: 0,
    strengthGirls: 0,
    isActive: 1,
  });

  // Fetch classes from the backend
  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter classes based on search query
  const filteredClasses = classes.filter((cls) =>
    cls.className && cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchClasses = () => {
    fetch("http://localhost:5000/api/classes")
      .then((res) => res.json())
      .then((data) => {
        const validClasses = data.filter((cls: Class) => cls.className && cls.isActive === 1);
        setClasses(validClasses);
      })
      .catch((error) => console.error("Error fetching classes:", error));
  };
  
  // Add or Update Class
  const handleSaveClass = () => {
    if (
      newClass.className &&
      newClass.session &&
      newClass.sections.length > 0 &&
      newClass.sections.every(section => section.trim() !== "")
    ) {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:5000/api/classes/${editingClassId}`
        : "http://localhost:5000/api/classes/add";
  
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newClass,
          // Filter out any empty sections
          sections: newClass.sections.filter(section => section.trim() !== "")
        }),
      })
        .then((response) => response.json())
        .then(() => {
          fetchClasses(); // Get fresh data from the backend
          setModalOpen(false);
          setIsEditing(false);
          setEditingClassId(null);
        })
        .catch((error) => console.error("Error saving class:", error));
    } else {
      alert("Please fill in all required fields and ensure sections are not empty");
    }
  };
  
  // Edit class
  const handleEditClass = (cls: Class) => {
    // Create a deep copy to avoid reference issues
    const clsToEdit = {
      ...cls,
      sections: [...cls.sections],
    };
    
    // If there are no sections, add an empty one for the UI
    if (clsToEdit.sections.length === 0) {
      clsToEdit.sections = [""];
    }
    
    setNewClass(clsToEdit);
    setIsEditing(true);
    setEditingClassId(cls._id);
    setModalOpen(true);
  };

  // Delete class
  const handleDeleteClass = (_id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      fetch(`http://localhost:5000/api/classes/${_id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchClasses(); // Refresh the data after deletion
        })
        .catch((error) => console.error("Error deleting class:", error));
    }
  };

  // Remove a section
  const handleRemoveSection = (index: number) => {
    // Don't allow removing the last section
    if (newClass.sections.length <= 1) {
      alert("At least one section is required.");
      return;
    }
    
    setNewClass((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Manage Classes</h3>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by class name"
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Classes Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Class Name</th>
              <th className="p-3 border border-gray-700">Session</th>
              <th className="p-3 border border-gray-700">Sections</th>
              <th className="p-3 border border-gray-700">Total Boys</th>
              <th className="p-3 border border-gray-700">Total Girls</th>
              <th className="p-3 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <tr key={cls._id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{cls.className}</td>
                  <td className="p-3">{cls.session}</td>
                  <td className="p-3">{cls.sections.join(", ")}</td>
                  <td className="p-3">{cls.strengthBoys}</td>
                  <td className="p-3">{cls.strengthGirls}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditClass(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteClass(cls._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-400">
                  No classes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Class Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            setNewClass({
              _id: "",
              className: "",
              session: "",
              sections: [""],
              strengthBoys: 0,
              strengthGirls: 0,
              isActive: 1,
            });
            setIsEditing(false);
            setModalOpen(true);
          }}
          className="bg-yellow-400 text-black px-5 py-2 rounded-md text-lg font-medium"
        >
          + Add Class
        </button>
      </div>

      {/* Modal for Add/Edit Class */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg w-96">
            <h2 className="text-yellow-400 text-xl mb-4">
              {isEditing ? "Edit Class" : "Add New Class"}
            </h2>
            <input
              type="text"
              placeholder="Class Name"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newClass.className}
              onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
            />
            <input
              type="text"
              placeholder="Session"
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md mb-2"
              value={newClass.session}
              onChange={(e) => setNewClass({ ...newClass, session: e.target.value })}
            />

            {/* Dynamic Sections Input */}
            <div className="mb-2">
              <label className="text-gray-400 block mb-1">Sections</label>
              {newClass.sections.map((section, index) => (
                <div key={index} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Section ${index + 1}`}
                    className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
                    value={section}
                    onChange={(e) => {
                      const updatedSections = [...newClass.sections];
                      updatedSections[index] = e.target.value;
                      setNewClass({ ...newClass, sections: updatedSections });
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleRemoveSection(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                className="text-yellow-400 hover:underline mt-1"
                onClick={() => setNewClass({ ...newClass, sections: [...newClass.sections, ""] })}
              >
                + Add More Sections
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="text-gray-400 hover:underline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClass}
                className="bg-yellow-400 text-black px-4 py-2 rounded-md"
              >
                {isEditing ? "Update Class" : "Add Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClass;