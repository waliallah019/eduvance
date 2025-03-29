import mongoose, { Schema, Document, Model } from "mongoose";
import IStudent from "../interface/student.interface";

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
