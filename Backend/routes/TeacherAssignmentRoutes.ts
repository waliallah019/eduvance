import express from "express";
import { saveTeacherAssignments, getTeacherAssignmentsByCourse } from "../Controllers/TeacherAssignmentController";

const router = express.Router();

router.post("/teacher-assignments", saveTeacherAssignments);
router.get("/teacher-assignments", getTeacherAssignmentsByCourse);


export default router;