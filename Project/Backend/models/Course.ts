import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
  name: string;
  code: string;
  description: string;
  instructors: string[];
  classIds: string[]; // Add this field
  isActive: number;
}

const CourseSchema = new Schema<ICourse>(
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

export default mongoose.model<ICourse>("Course", CourseSchema);