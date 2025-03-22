export interface TeacherStaff {
  _id: string;
  id: number;
  name: string;
  cnic: string;
  dob: string;
  contactNumber: string;
  email: string;
  employeeNumber: string;
  experience: string;
  salary: number;
  employmentType: "Full-time" | "Part-time" | "Contract";
  department: string;
  joiningDate: string;
  timeSlotStart: string; // Added time slot start
  timeSlotEnd: string; // Added time slot end
  documents: {
    resume: string | null;
    cnicCopy: string | null;
    educationCertificates: string | null;
    experienceCertificates: string | null;
    recentPhoto: string | null;
  };
  type: "teaching" | "non-teaching";
  role: string;
  user: string; // Reference to User ObjectId
  isActive?: boolean;
}

export interface ApiError {
  message: string;
  errors?: { msg: string }[];
}
