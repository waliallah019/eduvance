import { Request, Response } from "express";
import mongoose from "mongoose";

import Section from "../models/Section";
import Class from "../models/Class";
import User from "../models/User"

import {
  Student as Studentt,
} from "../models/StudentModel";
import cloudinaryConfig from "../config/cloudinary";

const { cloudinary } = cloudinaryConfig;

import fs from "fs";
import { constrainedMemory } from "process";

// Generate Roll Number
const generateRollNumber = async (
  ClassName: string,
  section: string
): Promise<{
  success: boolean;
  rollNumber?: string;
  message?: string;
}> => {
  try {
    // Find the highest existing roll number for the specified class and section
    const lastStudent = await Studentt.findOne({ ClassName, section })
      .sort({ rollNumber: -1 }) // Sort in descending order of rollNumber
      .limit(1);

    let nextNumber = 1; // Default starting number
    if (lastStudent && lastStudent.rollNumber) {
      const lastRollNumber = lastStudent.rollNumber;

      // Extract the numeric part from the roll number (assuming format is ClassName-Number-Section)
      const parts = lastRollNumber.split("-");
      if (parts.length === 3) {
        const lastNumber = parseInt(parts[1], 10); // Parse as base 10
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        } else {
          // If the numeric part is invalid, log a warning and start from 1
          console.warn(
            `Invalid numeric part in rollNumber: ${lastRollNumber}. Starting from 1.`
          );
        }
      } else {
        // If the rollNumber format is invalid, log a warning and start from 1
        console.warn(
          `Invalid rollNumber format: ${lastRollNumber}. Expected format: ClassName-Number-Section. Starting from 1.`
        );
      }
    }

    // Generate the new rollNumber
    const rollNumber = `${ClassName}-${nextNumber}-${section}`;

    // Check if the generated rollNumber already exists (to handle concurrency issues)
    const existingStudent = await Studentt.findOne({ rollNumber });
    if (existingStudent) {
      // If the rollNumber already exists, increment the number and try again
      nextNumber += 1;
      const newRollNumber = `${ClassName}-${nextNumber}-${section}`;
      return { success: true, rollNumber: newRollNumber };
    }

    return { success: true, rollNumber };
  } catch (error) {
    console.error("Error generating roll number:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, message: "Database error: " + errorMessage };
  }
};

// Cloudinary upload function
const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export const createStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      fatherCNIC,
      bFormNumberCNIC,
      dob,
      guardianContactNumber,
      guardianEmail,
      className,
      section,
      address,
      gender,
      username,
      password,
      classId,
    } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Generate roll number
    const rollNumberResult = await generateRollNumber(className, section);
    if (!rollNumberResult.success) {
      return res.status(400).json({
        error:
          rollNumberResult.message || "Failed to generate roll number",
      });
    }
  

    const user = new User({
      username,
      email: guardianEmail || `${username}@school.com`, // Use guardian email or fallback
      password: password,
      role: "student",
      isActive: 1, // Set user as active by default
    });

    await user.save([session]);

    // Create student data with user reference
    const studentData: any = {
      firstName,
      lastName,
      fatherName,
      motherName,
      fatherCNIC,
      bFormNumberCNIC,
      dob,
      guardianContactNumber,
      guardianEmail,
      ClassName: className,  // Corrected: use ClassName instead of className
      section,
      address,
      gender,
      rollNumber: rollNumberResult.rollNumber,
      isActive: 1, // Explicitly set as active
      userId: user._id,
      classId: classId // Link to the user
    };

    // Handle file uploads

    const files = req.files as any;

    let leavingCertificateUrl: string | null = null;
    let characterCertificateUrl: string | null = null;

    if (files?.leavingCertificate) {
      leavingCertificateUrl = await uploadToCloudinary(
        files.leavingCertificate.tempFilePath,
        "leavingCertificates"
      );

      // Delete the temporary file
      fs.unlinkSync(files.leavingCertificate.tempFilePath);
    }

    if (files?.characterCertificate) {
      characterCertificateUrl = await uploadToCloudinary(
        files.characterCertificate.tempFilePath,
        "characterCertificates"
      );
      // Delete the temporary file
      fs.unlinkSync(files.characterCertificate.tempFilePath);
    }

    studentData.leavingCertificate = leavingCertificateUrl;
    studentData.characterCertificate = characterCertificateUrl;

    // Create the student
    const student = new Studentt(studentData);
    await student.save({ session });

    // Update section strength based on gender
    let updateQuery = {};
    if (gender === "Male") {
      updateQuery = { $inc: { strengthBoys: 1 } };
    } else if (gender === "Female") {
      updateQuery = { $inc: { strengthGirls: 1 } };
    }

    await Section.updateOne(
      { classID: new mongoose.Types.ObjectId(classId), sectionName: section },
      updateQuery,
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Student created successfully with user account",
      data: {
        student,
        user: {
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error in createStudent:", error);
    return res.status(400).json({
      success: false,
      error:
        error.code === 11000
          ? "Duplicate entry found. CNIC, B-Form number, or username already exists."
          : "Failed to create student. Please try again.",
      message: error.message,
    });
  }
};

// Get all active students
export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Add pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Add filtering options
    const filter: any = { isActive: 1 };
    if (req.query.ClassName) filter.ClassName = req.query.ClassName;
    if (req.query.section) filter.section = req.query.section;
    if (req.query.gender) filter.gender = req.query.gender;

    const students = await Studentt.find(filter)
      .select("-__v") // Exclude version field
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JS objects for better performance

    const total = await Studentt.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: students.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: students,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: errorMessage,
    });
  }
};

// Get a specific student by ID
export const getStudentById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const student = await Studentt.findOne({
      _id: req.params.id,
      isActive: 1,
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: errorMessage,
    });
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Received studentId:", req.params.studentId); // Debugging log
    const { studentId } = req.params;
    // Find the student by ID
    console.log("studentId", studentId)
    const student = await Studentt.findById(studentId).session(session);
    console.log("student", student)
    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Student not found or already deleted",
      });
    }


    // Soft delete the student (mark as inactive)
    await Studentt.findByIdAndUpdate(
      studentId,
      { isActive: 0 }, // Set isActive to 0
      { session, new: true } // new: true returns the modified document
    );

    // Delete the corresponding user
    await User.findByIdAndDelete(student.userId, { session });

    // Decrement the section strength based on gender
    let updateQuery = {};
    if (student.gender === "Male") {
      updateQuery = { $inc: { strengthBoys: -1 } };
    } else if (student.gender === "Female") {
      updateQuery = { $inc: { strengthGirls: -1 } };
    }

    await Section.updateOne(
      {
        classID: student.classId,
        sectionName: student.section,
      },
      updateQuery,
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Student and user marked as inactive",
      data: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: errorMessage,
    });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;  // Renamed from studentId to id
    const updateData = { ...req.body };

    // First get the current student data
    const existingStudent = await Studentt.findById(id).session(session);

    if (!existingStudent) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if section is being updated
    if (
      updateData.section &&
      updateData.section !== existingStudent.section
    ) {
      const rollParts = existingStudent.rollNumber?.split("-") || [];
      if (rollParts.length === 3) {
        const className = rollParts[0];
        const number = rollParts[1];
        updateData.rollNumber = `${className}-${number}-${updateData.section}`;
      }
    }

    // Handle file uploads if present
    const files = req.files as any;

    let leavingCertificateUrl: string | null = null;
    let characterCertificateUrl: string | null = null;

    if (files?.leavingCertificate) {
      leavingCertificateUrl = await uploadToCloudinary(
        files.leavingCertificate.tempFilePath,
        "leavingCertificates"
      );
      // Delete the temporary file after uploading
      // Delete the temporary file
      fs.unlinkSync(files.leavingCertificate.tempFilePath);
    }

    if (files?.characterCertificate) {
      characterCertificateUrl = await uploadToCloudinary(
        files.characterCertificate.tempFilePath,
        "characterCertificates"
      );
      // Delete the temporary file after uploading
      fs.unlinkSync(files.characterCertificate.tempFilePath);
    }

    updateData.leavingCertificate = leavingCertificateUrl || existingStudent.leavingCertificate;  // Keep existing value if no new upload
    updateData.characterCertificate = characterCertificateUrl || existingStudent.characterCertificate; // Keep existing value if no new upload
    const classId = updateData.classId || existingStudent.classId;
    // Handle gender change - update section strength
    if (updateData.gender && updateData.gender !== existingStudent.gender) {

      const section = updateData.section || existingStudent.section;
        // Create update operation to adjust gender counts
        let updateQuery = {};

        // If changing from Female to Male
        if (existingStudent.gender === "Female" && updateData.gender === "Male") {
            updateQuery = {
                $inc: {
                  strengthGirls: -1,
                  strengthBoys: 1
                }
            };
        }
        // If changing from Male to Female
        else if (existingStudent.gender === "Male" && updateData.gender === "Female") {
            updateQuery = {
                $inc: {
                  strengthBoys: -1,
                  strengthGirls: 1
                }
            };
        }

        // Update the section strength based on gender change
        if (Object.keys(updateQuery).length > 0) {
            await Section.updateOne(
                { classID: new mongoose.Types.ObjectId(classId), sectionName: section },
                updateQuery,
                { session }
            );
        }
    }

    // Update the student
    const updatedStudent = await Studentt.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, session }
    );

    if (!updatedStudent) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Update the corresponding user if guardian email or username is changed
    if (updateData.guardianEmail || updateData.username) {
      const userUpdate: any = {};
      if (updateData.guardianEmail)
        userUpdate.email = updateData.guardianEmail;
      if (updateData.username) userUpdate.username = updateData.username;

      await User.findByIdAndUpdate(existingStudent.userId, userUpdate, {
        session,
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Student and user updated successfully",
      data: updatedStudent,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error updating student:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID format" });
    } else if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate entry found. CNIC or B-Form number already exists.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Failed to update student. Please try again.",
      error: error.message,
    });
  }
};

// Get all classes
export const getClasses = async (req: Request, res: Response): Promise<Response> => {
  try {
    const classes = await Class.find({ isActive: 1 });

    const classesWithSections = await Promise.all(
      classes.map(async (cls) => {
        const sections = await Section.find({ classID: cls._id });
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

    return res.json(classesWithSections); // ✅ Added 'return'
  } catch (error) {
    return res.status(500).json({ message: "Error fetching classes", error }); // ✅ Added 'return'
  }
};
