import { Request, Response } from "express";
import mongoose from "mongoose";
import CourseAssignment from "../models/CourseAssignment"; // Adjust the path based on your project structure

export const saveTeacherAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = req.body;
    console.log("Assignments:", assignments);

    // Validate that all teacher IDs are valid ObjectIds
    for (const assignment of assignments) {
      if (!mongoose.Types.ObjectId.isValid(assignment.teacher)) {
        res.status(400).json({ message: `Invalid teacher ID: ${assignment.teacher}` });
        return;
      }
    }

    // Check for existing assignments with the same section and course
    for (const assignment of assignments) {
      const existingAssignment = await CourseAssignment.findOne({
        section: assignment.section,
        course: assignment.course,
      });

      if (existingAssignment) {
        res.status(400).json({
          message: `A teacher is already assigned for section ${assignment.section} and course ${assignment.course}`,
        });
        return;
      }
    }

    // Save assignments to the database
    const savedAssignments = await CourseAssignment.insertMany(assignments);

    res.status(201).json({
      message: "Teacher assignments saved successfully",
      data: savedAssignments,
    });
  } catch (error) {
    console.error("Error saving teacher assignments:", error);
    res.status(500).json({
      message: "Failed to save teacher assignments",
      error: (error as Error).message,
    });
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