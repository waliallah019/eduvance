import { Request, Response } from "express";
import ClassModel from "../models/Class";
import SectionModel from "../models/Section";

export const addClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { className, session, sections } = req.body;

    if (!className || !session || !sections || !sections.length) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newClass = new ClassModel({
      className,
      session,
      timetable: null,
      highScorers: null,
      isActive: 1,
    });
    const savedClass = await newClass.save();

    const sectionDocs = sections.map((sectionName: string) => ({
      classID: savedClass._id,
      sectionName,
      strengthBoys: 0,
      strengthGirls: 0,
    }));
    await SectionModel.insertMany(sectionDocs);

    res.status(201).json({ message: "Class added successfully", class: savedClass });
  } catch (error) {
    res.status(500).json({ message: "Error adding class", error });
  }
};


export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { isActive: 0 },
      { new: true }
    );

    if (!updatedClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting class", error });
  }
};

// controllers/ClassController.ts
export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await ClassModel.find({ isActive: 1 });
    const classesWithSections = await Promise.all(
      classes.map(async (cls) => {
        const sections = await SectionModel.find({ classID: cls._id });
        const totalStrengthBoys = sections.reduce((sum, section) => sum + section.strengthBoys, 0);
        const totalStrengthGirls = sections.reduce((sum, section) => sum + section.strengthGirls, 0);

        return {
          ...cls.toObject(),
          sections: sections.map(section => section.sectionName),
          totalStrengthBoys,
          totalStrengthGirls,
        };
      })
    );

    res.json(classesWithSections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { className, session, sections } = req.body;

    if (!className || !session || !sections || !sections.length) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Update class details
    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { className, session },
      { new: true }
    );

    if (!updatedClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    // Fetch existing sections for the class
    const existingSections = await SectionModel.find({ classID: id });

    // Process each section in the request
    const updatedSections = await Promise.all(
      sections.map(async (sectionName: string) => {
        const existingSection = existingSections.find((s) => s.sectionName === sectionName);
        if (existingSection) {
          // If section exists, update it
          return SectionModel.findByIdAndUpdate(existingSection._id, { sectionName }, { new: true });
        } else {
          // If section does not exist, create a new one
          return SectionModel.create({
            classID: id,
            sectionName,
            strengthBoys: 0,
            strengthGirls: 0,
          });
        }
      })
    );

    // Remove sections that are no longer in the updated list
    const sectionNames = sections.map((s: string) => s);
    await SectionModel.deleteMany({ classID: id, sectionName: { $nin: sectionNames } });

    res.json({
      message: "Class updated successfully",
      class: updatedClass,
      sections: updatedSections,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating class", error });
  }
};
