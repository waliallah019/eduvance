import { Request, Response } from "express";
import CourseAssignment from "../models/CourseAssignment";
import mongoose from "mongoose";

export const saveTeacherAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = req.body;
    
    // Validate that all assignments have a 'section'
    for (const assignment of assignments) {
      if (!assignment.section) {
        assignments.remove(assignment)
        // throw new Error(`Missing section in assignment: ${JSON.stringify(assignment)}`);
      }
      if (!mongoose.Types.ObjectId.isValid(assignment.teacher)) {
        throw new Error(`Invalid teacher ID: ${assignment.teacher}`);
      }
      if (!mongoose.Types.ObjectId.isValid(assignment.course)) {
        throw new Error(`Invalid course ID: ${assignment.course}`);
      }
      if (!mongoose.Types.ObjectId.isValid(assignment.section)) {
        throw new Error(`Invalid section ID: ${assignment.section}`);
      }
    }
    console.log("Assignments Received:", assignments);

    // Save assignments to the database
    const savedAssignments = await CourseAssignment.insertMany(assignments);
    
    // Send success response
    res.status(201).json(savedAssignments);
  } catch (error) {
    console.error("Error saving teacher assignments:", error);
    res.status(400).json({ message: error });
  }
};

// Fetch teacher assignments for a course
export const getTeacherAssignmentsByCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.query;
    const assignments = await CourseAssignment.find({ course }).populate("section").populate("teacher");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher assignments", error: err });
  }
};