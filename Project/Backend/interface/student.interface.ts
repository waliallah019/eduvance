import mongoose, { Document } from "mongoose";
interface IStudent extends Document {
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    fatherCNIC: string;
    bFormNumberCNIC: string;
    dob: string;
    guardianContactNumber: string;
    guardianEmail?: string;
    ClassName: string;
    classId: mongoose.Schema.Types.ObjectId; // ADD THIS LINE
    section?: string;
    address: string;
    gender: "Male" | "Female" | "Other";
    rollNumber?: string;
    characterCertificate?: string;
    leavingCertificate?: string;
    isActive: number;
    userId: mongoose.Types.ObjectId;
  }
  
  export default IStudent;