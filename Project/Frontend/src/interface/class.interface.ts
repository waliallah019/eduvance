export interface Class {
    _id: string;
    className: string;
    session: string;
    sections: string[];
    strengthBoys: number;
    strengthGirls: number;
    isActive: number;
}
  
export interface Section {
    _id: string;
    sectionName: string;
    classID: string;
  }
  