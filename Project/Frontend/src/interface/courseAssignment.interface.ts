export interface ICourseAssignment extends Document {
    _id: string;
    section: string
    teacher: string
    course: string
    timeSlot: string;
    courseName?: string;
    sectionName?: string;
    teacherName?: string;
    className?: string;
  }

  
