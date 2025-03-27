import express, { Request, Response, NextFunction } from "express";
import cloudinaryConfig from "../config/cloudinary";

import {
  createStudent,
  getAllStudents,
  deleteStudent,
  updateStudent,
  getClasses
} from "../controllers/studentControllers";

const router = express.Router();

// Wrap async controllers to handle the Promise<Response> return type
const asyncHandler = (
  fn: (req: Request, res: Response) => Promise<Response>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res)).catch(next);
};

// GET all students
router.get("/", asyncHandler(getAllStudents));

// POST a new student
router.post("/", asyncHandler(createStudent));

// PUT (Update) student
router.put("/:id", asyncHandler(updateStudent));

// DELETE a student
router.delete("/:studentId", asyncHandler(deleteStudent));

// GET all classes
router.get("/classes", asyncHandler(getClasses));

module.exports = router;
