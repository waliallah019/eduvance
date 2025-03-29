import mongoose from "mongoose";
interface IStaff extends Document {
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
      resume: string;
      cnicCopy: string;
      educationCertificates: string;
      experienceCertificates: string;
      recentPhoto: string;
    };
    type: "teaching" | "non-teaching";
    role: string;
    user: mongoose.Schema.Types.ObjectId; // Reference to User ObjectId
    isActive: boolean;
  }


  export default IStaff;