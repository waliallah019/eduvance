import { Request, Response } from "express";
import Staff, { IStaff } from "../models/Staff";
import User from "../models/User"; // Import the User model
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (
  path: string,
  folder: string,
): Promise<string | undefined> => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return undefined;
  }
};

// @desc    Get all staff (active only)
// @route   GET /api/staff
// @access  Public (or use authMiddleware for protected access)
const getStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.find({ isActive: true }).populate("user", [
      "username",
      "email",
    ]); // Populate user details
    res.json(staff);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get staff by ID
// @route   GET /api/staff/:id
// @access  Public (or use authMiddleware)
const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id).populate("user", [
      "username",
      "email",
    ]); // Populate user details
    if (!staff) {
      res.status(404).json({ msg: "Staff not found" });
      return;
    }
    res.json(staff);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      res.status(404).json({ msg: "Staff not found" });
      return;
    }
    res.status(500).send("Server Error");
  }
};

// @desc    Create new staff
// @route   POST /api/staff
// @access  Public (or use authMiddleware)
const createStaff = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const {
      name,
      cnic,
      dob,
      contactNumber,
      email,
      experience,
      salary,
      employmentType,
      department,
      joiningDate,
      type,
      role,
      timeSlotStart, // time slot start
      timeSlotEnd, // time slot end
      username,
      password,
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ errors: [{ msg: "User already exists" }] });
      return; // Avoid further execution
    }
    // Create a new user
    user = new User({
      username,
      email,
      password,
      role: role === "Teacher" ? "teacher" : "admin",
    });

    // Hash the password
    await user.save();

    // Upload documents to Cloudinary
    const resumeUrl = req.files?.resume
      ? await uploadToCloudinary(
        (req.files?.resume as any).tempFilePath,
        "staff-documents",
      )
      : null;
    const cnicCopyUrl = req.files?.cnicCopy
      ? await uploadToCloudinary(
        (req.files?.cnicCopy as any).tempFilePath,
        "staff-documents",
      )
      : null;
    const educationCertificatesUrl = req.files?.educationCertificates
      ? await uploadToCloudinary(
        (req.files?.educationCertificates as any).tempFilePath,
        "staff-documents",
      )
      : null;
    const experienceCertificatesUrl = req.files?.experienceCertificates
      ? await uploadToCloudinary(
        (req.files?.experienceCertificates as any).tempFilePath,
        "staff-documents",
      )
      : null;
    const recentPhotoUrl = req.files?.recentPhoto
      ? await uploadToCloudinary(
        (req.files?.recentPhoto as any).tempFilePath,
        "staff-documents",
      )
      : null;

    if (!user._id) {
      throw new Error("User ID is undefined");
    }

    const newStaff: IStaff = new Staff({
      name,
      cnic,
      dob,
      contactNumber,
      email,
      experience,
      salary,
      employmentType,
      department,
      joiningDate,
      timeSlotStart, // time slot start
      timeSlotEnd, // time slot end
      documents: {
        resume: resumeUrl || "",
        cnicCopy: cnicCopyUrl || "",
        educationCertificates: educationCertificatesUrl || "",
        experienceCertificates: experienceCertificatesUrl || "",
        recentPhoto: recentPhotoUrl || "",
      },
      type,
      role,
      user: user._id, // Assign the User's ObjectId to the staff
    });

    await newStaff.save();

    res.json(newStaff);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update staff by ID
// @route   PUT /api/staff/:id
// @access  Public (or use authMiddleware)
const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      cnic,
      dob,
      contactNumber,
      email,
      experience,
      salary,
      employmentType,
      department,
      joiningDate,
      type,
      role,
      timeSlotStart, // time slot start
      timeSlotEnd, // time slot end
    } = req.body;

    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      res.status(404).json({ msg: "Staff not found" });
      return;
    }

    // Upload documents to Cloudinary
    const resumeUrl = req.files?.resume
      ? await uploadToCloudinary(
        (req.files?.resume as any).tempFilePath,
        "staff-documents",
      )
      : staff.documents.resume;
    const cnicCopyUrl = req.files?.cnicCopy
      ? await uploadToCloudinary(
        (req.files?.cnicCopy as any).tempFilePath,
        "staff-documents",
      )
      : staff.documents.cnicCopy;
    const educationCertificatesUrl = req.files?.educationCertificates
      ? await uploadToCloudinary(
        (req.files?.educationCertificates as any).tempFilePath,
        "staff-documents",
      )
      : staff.documents.educationCertificates;
    const experienceCertificatesUrl = req.files?.experienceCertificates
      ? await uploadToCloudinary(
        (req.files?.experienceCertificates as any).tempFilePath,
        "staff-documents",
      )
      : staff.documents.experienceCertificates;
    const recentPhotoUrl = req.files?.recentPhoto
      ? await uploadToCloudinary(
        (req.files?.recentPhoto as any).tempFilePath,
        "staff-documents",
      )
      : staff.documents.recentPhoto;

    const staffFields = {
      name,
      cnic,
      dob,
      contactNumber,
      email,
      experience,
      salary,
      employmentType,
      department,
      joiningDate,
      timeSlotStart, // time slot start
      timeSlotEnd, // time slot end
      documents: {
        resume: resumeUrl || "",
        cnicCopy: cnicCopyUrl || "",
        educationCertificates: educationCertificatesUrl || "",
        experienceCertificates: experienceCertificatesUrl || "",
        recentPhoto: recentPhotoUrl || "",
      },
      type,
      role,
    };

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true },
    );

    res.json(updatedStaff);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete staff (soft delete)
// @route   DELETE /api/staff/:id
// @access  Public (or use authMiddleware)
const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      res.status(404).json({ msg: "Staff not found" });
      return;
    }

    staff.isActive = false;
    await staff.save();

    res.json({ msg: "Staff deleted (soft delete)" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export { getStaff, getStaffById, createStaff, updateStaff, deleteStaff };
