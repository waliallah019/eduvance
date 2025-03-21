import mongoose, { Schema, Document } from "mongoose";

interface ITeacher extends Document {
  name: string;
  isActive: number;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    isActive: { type: Number, default: 1 }, // 1 = Active, 0 = Deleted
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>("Teacher", TeacherSchema);