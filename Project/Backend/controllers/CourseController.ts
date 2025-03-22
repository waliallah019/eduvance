import { Request, Response } from "express";
import Course from "../models/Course";
import Section from "../models/Section";
import Class from "../models/Class";

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ isActive: 1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({ isActive: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

export const addCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description, classIds } = req.body;
    const newCourse = new Course({ name, code, description, instructors: [], classIds, isActive: 1 });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, code, description, instructors, classIds } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, code, description, instructors, classIds },
      { new: true }
    );

    if (!updatedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndUpdate(id, { isActive: 0 }, { new: true });
    if (!deletedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json({ message: "Course deactivated", deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

export const getSectionsByClassIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classIds } = req.body;
    const sections = await Section.find({ classId: { $in: classIds } });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections", error });
  }
};

export const assignTeachers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { instructors, sections } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { instructors, sections },
      { new: true }
    );
    if (!updatedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error assigning teachers and sections", error });
  }
};