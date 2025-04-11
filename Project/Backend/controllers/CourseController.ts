import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course";
import Section from "../models/Section";
import Class from "../models/Class";
import CourseAssignment from "../models/CourseAssignment";
import ICourseAssignment from "../interface/courseAssignment.interface";

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
    const result = await Course.aggregate([
      {
        $match: { isActive: 1 }
      },
      // Convert classIds (strings) to ObjectIds for matching
      {
        $addFields: {
          classIdsObj: {
            $map: {
              input: '$classIds',
              as: 'id',
              in: { $toObjectId: '$$id' }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'sections',
          localField: 'classIdsObj',
          foreignField: 'classID',
          as: 'allSections'
        }
      },
      {
        $lookup: {
          from: 'courseassignments',
          localField: '_id',
          foreignField: 'course',
          as: 'assignments'
        }
      },
      {
        $addFields: {
          assignedSectionIds: {
            $map: {
              input: '$assignments',
              as: 'a',
              in: '$$a.section'
            }
          }
        }
      },
      {
        $addFields: {
          unassignedSections: {
            $filter: {
              input: '$allSections',
              as: 'section',
              cond: {
                $not: { $in: ['$$section._id', '$assignedSectionIds'] }
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: '$unassignedSections',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'unassignedSections.classID',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $unwind: {
          path: '$classInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          course: { $first: '$$ROOT' },
          unassignedSectionNames: {
            $push: {
              $cond: [
                { $ifNull: ['$unassignedSections', false] },
                {
                  $concat: [
                    '$unassignedSections.sectionName',
                    ' (',
                    '$classInfo.className',
                    ')'
                  ]
                },
                '$$REMOVE'
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          course: {
            _id: '$course._id',
            name: '$course.name',
            classIds: '$course.classIds',
            isActive: '$course.isActive',
            description: '$course.description',
            code: '$course.code'
          },
          unassignedSectionNames: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};


export const addCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description, classIds } = req.body;
    const newCourse = new Course({ name, code, description, classIds, isActive: 1 });
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