import express from "express";
import { getCourses, addCourse, updateCourse, deleteCourse, assignTeachers, getSectionsByClassIds } from "../controllers/CourseController";

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.put("/:id/assign-teachers", assignTeachers);
router.delete("/:id", deleteCourse);
router.post("/sections", getSectionsByClassIds);

module.exports = router;