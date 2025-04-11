export interface Course {
    _id: string;
    name: string;
    code: string;
    description: string;
    instructors: string[];
    classIds: string[];
    isActive: number;
    unassignedSectionNames?: string[];
  }


  