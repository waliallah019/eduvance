export interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  classIds: string[];
  instructors: string[];
  isActive: number;
}