import mongoose from 'mongoose';
import Section from '../models/Section';
import Teacher from '../models/Staff';
import Course from '../models/Course';

interface ICourseAssignment extends Document {
    section: mongoose.Schema.Types.ObjectId | typeof Section;
    teacher: mongoose.Schema.Types.ObjectId | typeof Teacher; // Reference to Teacher
    course: mongoose.Schema.Types.ObjectId | typeof Course;
    timeSlot: string;
    courseName?: string;
    sectionName?: string;
    teacherName?: string;
    className?: string;
  }

  
  export default ICourseAssignment;