import mongoose, { Schema, Document } from "mongoose";

interface IClass extends Document {
  className: string;
  session: string;
  timetable?: string | null;
  highScorers?: string | null;
  isActive: number;
}

const ClassSchema = new Schema<IClass>({
  className: { type: String, required: true },
  session: { type: String, required: true },
  timetable: { type: String, default: null },
  highScorers: { type: String, default: null },
  isActive: { type: Number, default: 1 },
});

export default mongoose.model<IClass>("Class", ClassSchema);