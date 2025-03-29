import mongoose from "mongoose";
interface ISection extends Document {
    classID: mongoose.Schema.Types.ObjectId;
    sectionName: string;
    strengthBoys: number;
    strengthGirls: number;
    isActive: number; // Add isActive field for soft delete
  }

  export default ISection;