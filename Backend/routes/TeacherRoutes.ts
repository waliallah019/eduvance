import express from "express";
import { getTeachers } from "../Controllers/TeacherController";

const router = express.Router();

// Route to get active teachers
router.get("/", getTeachers);

export default router;