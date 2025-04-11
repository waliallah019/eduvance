import express from "express";
import { saveTeacherAssignments, getTeacherAssignmentsByCourse} from "../controllers/CourseAssignmentController";

const router = express.Router();

router.post("/teacher-assignments", saveTeacherAssignments);
router.get("/teacher-assignments/:courseId", getTeacherAssignmentsByCourse);

module.exports = router;
