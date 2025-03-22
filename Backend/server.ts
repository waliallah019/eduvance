import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import courseRoutes from "./routes/CourseRoutes";
import classRoutes from "./routes/ClassRoutes";
import sectionRoutes from "./routes/SectionRoutes";
import teacherAssignmentRoutes from "./routes/TeacherAssignmentRoutes";
 import teacherRoutes from "./routes/TeacherRoutes";


import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api", sectionRoutes);
app.use("/api", teacherAssignmentRoutes);
app.use("/api/teachers", teacherRoutes);


// app.use("/api/teachers", teacherRoutes);


// Database Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
