import mongoose, { Schema, Document } from "mongoose";
import Teacher from "./Staff";
import Section from "./Section";
import Course from "./Course";

interface ICourseAssignment extends Document {
  section: mongoose.Schema.Types.ObjectId | typeof Section;
  teacher: mongoose.Schema.Types.ObjectId | typeof Teacher; // Reference to Teacher
  course: mongoose.Schema.Types.ObjectId | typeof Course;
  timeSlot: string;
}

const CourseAssignmentSchema = new Schema<ICourseAssignment>({
  section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true }, // Reference to Teacher
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  timeSlot: { type: String, default: "None" },
});

export default mongoose.model<ICourseAssignment>("CourseAssignment", CourseAssignmentSchema);