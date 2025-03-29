import mongoose, { Schema, Document } from "mongoose";
import { Course } from "../interface/CourseInterface";

const CourseSchema = new Schema<Course>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructors: { type: [String], default: [] },
    classIds: { type: [String], default: [] }, // Add this field
    isActive: { type: Number, default: 1 }, // 1 = Active, 0 = Deleted
  },
  { timestamps: true }
);

export default mongoose.model<Course>("Course", CourseSchema);