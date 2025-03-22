import express from "express";
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getTeachers,
} from "../controllers/staffController";
import { check } from "express-validator";

const router = express.Router();

router.get("/", getStaff);
router.get("/teachers", getTeachers);
router.get("/:id", getStaffById);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("cnic", "CNIC is required").not().isEmpty(),
    check("dob", "Date of birth is required").not().isEmpty(),
    check("contactNumber", "Contact number is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("salary", "Salary is required").isNumeric(),
    check("employmentType", "Employment type is required").not().isEmpty(),
    check("department", "Department is required").not().isEmpty(),
    check("joiningDate", "Joining date is required").not().isEmpty(),
    check("timeSlotStart", "Time slot start is required").not().isEmpty(), // time slot start
    check("timeSlotEnd", "Time slot end is required").not().isEmpty(), // time slot end
    check("type", "Staff type is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  createStaff,
);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;