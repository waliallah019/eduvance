import { Request, Response } from "express";
import Teacher from "../models/Teacher";
import Class from "../models/Class";



// Get Active Teachers
export const getTeachers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teachers = await Teacher.find({ isActive: 1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error });
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