import { Request, Response } from "express";
import Section from "../models/Section";

export const getSectionsByClassIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classIds } = req.body;
    const sections = await Section.find({ classID: { $in: classIds }, isActive: 1 });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections", error });
  }
};