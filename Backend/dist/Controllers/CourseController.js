"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTeachers = exports.deleteCourse = exports.updateCourse = exports.addCourse = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
// Get Active Courses
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.default.find({ isActive: 1 });
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});
exports.getCourses = getCourses;
// Add New Course
const addCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code, description } = req.body;
        const newCourse = new Course_1.default({ name, code, description, instructors: [], isActive: 1 });
        yield newCourse.save();
        res.status(201).json(newCourse);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding course", error });
    }
});
exports.addCourse = addCourse;
// Update Course
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCourse = yield Course_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCourse) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.status(200).json(updatedCourse);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating course", error });
    }
});
exports.updateCourse = updateCourse;
// Soft Delete Course
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCourse = yield Course_1.default.findByIdAndUpdate(id, { isActive: 0 }, { new: true });
        if (!deletedCourse) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.status(200).json({ message: "Course deactivated", deletedCourse });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting course", error });
    }
});
exports.deleteCourse = deleteCourse;
// Assign Teachers
const assignTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { instructors } = req.body;
        const updatedCourse = yield Course_1.default.findByIdAndUpdate(id, { instructors }, { new: true });
        if (!updatedCourse) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.status(200).json(updatedCourse);
    }
    catch (error) {
        res.status(500).json({ message: "Error assigning teachers", error });
    }
});
exports.assignTeachers = assignTeachers;
