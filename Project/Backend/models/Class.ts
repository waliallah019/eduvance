import mongoose, { Schema, Document } from "mongoose";
import IClass from "../interface/class.interface";

const ClassSchema = new Schema<IClass>({
  className: { type: String, required: true },
  session: { type: String, required: true },
  timetable: { type: String, default: null },
  highScorers: { type: String, default: null },
  isActive: { type: Number, default: 1 },
});

export default mongoose.model<IClass>("Class", ClassSchema);