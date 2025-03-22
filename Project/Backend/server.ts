import fileUpload from "express-fileupload";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// server.js (Main server entry point)
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const staffRoutes = require('./routes/staffRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classRoutes = require('./routes/classRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const teacherAssignmentRoutes = require('./routes/CourseAssignmentRoutes');


const app = express();
connectDB();

const cors = require('cors');
app.use(cors());


app.use(express.json()); // Middleware for parsing JSON requests

app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api", sectionRoutes);
app.use("/api", teacherAssignmentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));