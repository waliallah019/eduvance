import { Request, Response } from "express";
import Staff from "../models/Staff";
import IStaff  from "../interface/staff.interface";
import User from "../models/User"; // Import the User model
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
import Class from "../models/Class";

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
      timeSlotStart,
      timeSlotEnd,
      username,
      password,
    } = req.body;

    const teachingRoles = [
      "Teacher",
      "Senior Teacher",
      "Head of Department",
      "Coordinator",
    ];
    const nonTeachingRoles = [
      "Librarian",
      "Administrator",
      "Maintenance Staff",
      "Lab Assistant",
      "Clerk",
    ];

    let assignedRole = "admin"; // Default fallback

    if (teachingRoles.includes(role)) {
      assignedRole = "teacher";
    } else if (nonTeachingRoles.includes(role)) {
      assignedRole = "non-teaching-staff";
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ errors: [{ msg: "User already exists" }] });
      return;
    }

    // Create a new user
    user = new User({
      username,
      email,
      password,
      role: assignedRole, // Use the assigned role
    });

    // Hash the password
    await user.save();

    // Upload documents to Cloudinary
    const uploadDocument = async (file: any, folder: string) => 
      file ? await uploadToCloudinary(file.tempFilePath, folder) : null;

    const resumeUrl = await uploadDocument(req.files?.resume, "staff-documents");
    const cnicCopyUrl = await uploadDocument(req.files?.cnicCopy, "staff-documents");
    const educationCertificatesUrl = await uploadDocument(req.files?.educationCertificates, "staff-documents");
    const experienceCertificatesUrl = await uploadDocument(req.files?.experienceCertificates, "staff-documents");
    const recentPhotoUrl = await uploadDocument(req.files?.recentPhoto, "staff-documents");

    if (!user._id) {
      throw new Error("User ID is undefined");
    }

    const newStaff = new Staff({
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
      timeSlotStart,
      timeSlotEnd,
      documents: {
        resume: resumeUrl || "",
        cnicCopy: cnicCopyUrl || "",
        educationCertificates: educationCertificatesUrl || "",
        experienceCertificates: experienceCertificatesUrl || "",
        recentPhoto: recentPhotoUrl || "",
      },
      type,
      role,
      user: user._id,
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

// Get Active Teachers
const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Staff.find({ isActive: true , type: "teaching" });
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers", error: err });
  }
};

// Get Active Classes
const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ isActive: 1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

export { getStaff, getStaffById, createStaff, updateStaff, deleteStaff, getTeachers, getClasses };
