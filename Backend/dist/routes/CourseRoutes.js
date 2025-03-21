"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CourseController_1 = require("../Controllers/CourseController");
const router = express_1.default.Router();
// Routes
router.get("/", CourseController_1.getCourses);
router.post("/", CourseController_1.addCourse);
router.put("/:id", CourseController_1.updateCourse);
router.put("/:id/assign-teachers", CourseController_1.assignTeachers);
router.delete("/:id", CourseController_1.deleteCourse);
exports.default = router;
