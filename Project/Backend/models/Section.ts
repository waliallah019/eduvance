import mongoose, { Schema, Document } from "mongoose";

interface ISection extends Document {
  classID: mongoose.Schema.Types.ObjectId;
  sectionName: string;
  strengthBoys: number;
  strengthGirls: number;
  isActive: number; // Add isActive field for soft delete
}

const SectionSchema = new Schema<ISection>({
  classID: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  sectionName: { type: String, required: true },
  strengthBoys: { type: Number, default: 0 },
  strengthGirls: { type: Number, default: 0 },
  isActive: { type: Number, default: 1 }, // 1 = Active, 0 = Deleted
});

export default mongoose.model<ISection>("Section", SectionSchema);