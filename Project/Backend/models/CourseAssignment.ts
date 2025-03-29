import mongoose, { Schema, Document } from "mongoose";

import ICourseAssignment from "../interface/courseAssignment.interface";

const CourseAssignmentSchema = new Schema<ICourseAssignment>({
  section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true }, // Reference to Teacher
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  timeSlot: { type: String, default: "None" },
});

export default mongoose.model<ICourseAssignment>("CourseAssignment", CourseAssignmentSchema);