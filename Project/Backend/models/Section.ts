import mongoose, { Schema, Document } from "mongoose";
import ISection from "../interface/section.interface";

const SectionSchema = new Schema<ISection>({
  classID: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  sectionName: { type: String, required: true },
  strengthBoys: { type: Number, default: 0 },
  strengthGirls: { type: Number, default: 0 },
  isActive: { type: Number, default: 1 }, // 1 = Active, 0 = Deleted
});

export default mongoose.model<ISection>("Section", SectionSchema);