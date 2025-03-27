import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../interface/user.interface";

// Student Interface
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

const StudentSchema: Schema<IStudent> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherCNIC: { type: String, required: true, unique: true },
    bFormNumberCNIC: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    guardianContactNumber: { type: String, required: true },
    guardianEmail: { type: String },
    ClassName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, // ADD THIS LINE
    section: { type: String },
    address: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    rollNumber: { type: String, unique: true },
    characterCertificate: { type: String },
    leavingCertificate: { type: String },
    isActive: { type: Number, default: 1 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Models
const Student: Model<IStudent> = mongoose.model<IStudent>(
  "Student",
  StudentSchema,
  "Students"
);

export { Student};
