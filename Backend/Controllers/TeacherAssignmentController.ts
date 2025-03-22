import { Request, Response } from "express";
import TeacherAssignment from "../models/TeacherAssignment";
import mongoose from "mongoose";

export const saveTeacherAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = req.body;

    // Validate that all teacher IDs are valid ObjectIds
    for (const assignment of assignments) {
      if (!mongoose.Types.ObjectId.isValid(assignment.teacher)) {
        throw new Error(`Invalid teacher ID: ${assignment.teacher}`);
      }
    }

    // Save assignments to the database
    const savedAssignments = await TeacherAssignment.insertMany(assignments);

    // Send success response
    res.status(201).json(savedAssignments);
  } catch (error) {
    console.error("Error saving teacher assignments:", error);
    res.status(500).json({ message: "Failed to save teacher assignments", error });
  }
};

// Fetch teacher assignments for a course
export const getTeacherAssignmentsByCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.query;
    const assignments = await TeacherAssignment.find({ course }).populate("section").populate("teacher");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher assignments", error: err });
  }
};