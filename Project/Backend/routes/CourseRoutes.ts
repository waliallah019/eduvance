import express from "express";
import { getCourses, addCourse, updateCourse, deleteCourse, getSectionsByClassIds } from "../controllers/CourseController";

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/sections", getSectionsByClassIds);

module.exports = router;