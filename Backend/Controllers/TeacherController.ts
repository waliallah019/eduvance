import { Request, Response } from "express";
import Teacher from "../models/Teacher";
import Class from "../models/Class";



// Get Active Teachers
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find({ isActive: 1 }); // Fetch only active teachers
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers", error: err });
  }
};

// Get Active Classes
export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ isActive: 1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};