import mongoose, { Schema, Document } from "mongoose";
import IStaff  from "../interface/staff.interface";


const StaffSchema: Schema = new Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeNumber: { type: String, unique: true },
  experience: { type: String },
  salary: { type: Number, required: true },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract"],
    required: true,
  },
  department: { type: String, required: true },
  joiningDate: { type: String, required: true },
  timeSlotStart: { type: String }, // Added time slot start
  timeSlotEnd: { type: String }, // Added time slot end
  documents: {
    resume: { type: String },
    cnicCopy: { type: String },
    educationCertificates: { type: String },
    experienceCertificates: { type: String },
    recentPhoto: { type: String },
  },
  type: { type: String, enum: ["teaching", "non-teaching"], required: true },
  role: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //  reference to the User model
  },
  isActive: { type: Boolean, default: true },
});

StaffSchema.pre("save", async function (next) {
  if (!this.employeeNumber) {
    const prefix = this.type === "teaching" ? "TCH" : "NTS";
    const count = await mongoose
      .model("Staff", StaffSchema)
      .countDocuments({ type: this.type });
    this.employeeNumber = `${prefix}${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

export default mongoose.model<IStaff>("Staff", StaffSchema, "Staff");
