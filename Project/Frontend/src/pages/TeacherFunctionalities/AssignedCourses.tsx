import { useState } from "react";
import { Calendar, Users, Book, Clock } from "lucide-react";

interface Course {
  name: string;
  code: string;
  students: number;
  schedule: string;
  materials: string[];
  upcoming: string;
}

const AssignedCourses = () => {
  const [courses] = useState<Course[]>([
    {
      name: "Mathematics",
      code: "MATH101",
      students: 32,
      schedule: "Mon, Wed 10:00 AM",
      materials: ["Calculus Textbook", "Practice Problems", "Formula Sheet"],
      upcoming: "Quiz on Functions"
    },
    {
      name: "Science",
      code: "SCI102",
      students: 28,
      schedule: "Tue, Thu 11:30 AM",
      materials: ["Physics Lab Manual", "Periodic Table", "Lab Safety Guide"],
      upcoming: "Lab Report Due"
    },
    {
      name: "English",
      code: "ENG103",
      students: 25,
      schedule: "Mon, Fri 2:00 PM",
      materials: ["Literature Anthology", "Writing Guide", "Grammar Handbook"],
      upcoming: "Essay Submission"
    },
  ]);

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-6">Assigned Courses</h3>
      <div className="grid gap-4">
        {courses.map((course, index) => (
          <div key={index} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-200">{course.name}</h4>
                <p className="text-gray-400">{course.code}</p>
              </div>
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                {course.schedule}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                <span>{course.students} Students</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <span>Next: {course.upcoming}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Course Materials:</p>
              <div className="flex flex-wrap gap-2">
                {course.materials.map((material, idx) => (
                  <span key={idx} className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                    <Book className="w-3 h-3 inline mr-1" />
                    {material}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedCourses;