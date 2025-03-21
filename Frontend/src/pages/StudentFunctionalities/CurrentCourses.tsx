import React, { useState } from 'react';
import { Book, Calendar, Users, Clock, ChevronDown, Bell, FileText, AlertCircle, Bookmark } from 'lucide-react';

interface Course {
  code: string;
  name: string;
  attendance: string;
  runningAttendance: string;
  teacher: string;
  semester: string;
  schedule: string[];
  nextClass: string;
  notifications: number;
  assignments: {
    total: number;
    pending: number;
    nextDue?: string;
  };
  materials: string[];
  progress: {
    quizzes: number;
    assignments: number;
    midterm?: number;
  };
}

const courses: Course[] = [
  {
    code: "SE-441",
    name: "Software Project Management A",
    attendance: "0 (0/32)",
    runningAttendance: "0%",
    teacher: "Dr Syed Khaldoon Khurshid",
    semester: "SPRING 2025",
    schedule: ["Monday 10:00 AM - 11:30 AM", "Wednesday 10:00 AM - 11:30 AM"],
    nextClass: "Monday 10:00 AM",
    notifications: 2,
    assignments: {
      total: 3,
      pending: 1,
      nextDue: "28 Feb 2025"
    },
    materials: ["Course Outline", "Project Management Handbook", "Week 1-4 Slides"],
    progress: {
      quizzes: 85,
      assignments: 90,
      midterm: 88
    }
  },
  {
    code: "CS-483",
    name: "Cloud Computing A",
    attendance: "0 (0/16)",
    runningAttendance: "0%",
    teacher: "Amjad Farooq",
    semester: "SPRING 2025",
    schedule: ["Tuesday 11:30 AM - 1:00 PM"],
    nextClass: "Tuesday 11:30 AM",
    notifications: 1,
    assignments: {
      total: 2,
      pending: 1,
      nextDue: "1 Mar 2025"
    },
    materials: ["AWS Guide", "Docker Tutorial", "Cloud Architecture Basics"],
    progress: {
      quizzes: 78,
      assignments: 85
    }
  },
  {
    code: "QT-301",
    name: "Translation of the Holy Quran - III B",
    attendance: "0 (0/32)",
    runningAttendance: "0%",
    teacher: "Hafiz Muhammad Naeem Saif Ul Islam",
    semester: "SPRING 2025",
    schedule: ["Thursday 2:00 PM - 3:30 PM"],
    nextClass: "Thursday 2:00 PM",
    notifications: 0,
    assignments: {
      total: 2,
      pending: 0
    },
    materials: ["Course Notes", "Reference Materials"],
    progress: {
      quizzes: 92,
      assignments: 95
    }
  },
  {
    code: "CS-372",
    name: "Parallel and Distributed Computing B",
    attendance: "0 (0/16)",
    runningAttendance: "0%",
    teacher: "Dr Muhammad Junaid Arshad",
    semester: "SPRING 2025",
    schedule: ["Friday 11:30 AM - 1:00 PM"],
    nextClass: "Friday 11:30 AM",
    notifications: 3,
    assignments: {
      total: 4,
      pending: 2,
      nextDue: "26 Feb 2025"
    },
    materials: ["OpenMP Guide", "MPI Tutorial", "Distributed Systems Notes"],
    progress: {
      quizzes: 82,
      assignments: 88
    }
  },
];

const CurrentCourses = () => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterCourses = () => {
    switch (activeTab) {
      case 'upcoming':
        return courses.filter(course => course.assignments?.pending > 0);
      case 'notifications':
        return courses.filter(course => course.notifications > 0);
      default:
        return courses;
    }
  };

  const getAttendanceColor = (attendance: string) => {
    const percentage = parseInt(attendance);
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-yellow-400">Current Courses</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'all' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'upcoming' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Upcoming Due
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notifications' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Notifications
          </button>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-2 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filterCourses().map((course, index) => (
          <div 
            key={index}
            className="bg-gray-800 rounded-lg shadow-md border border-gray-600 overflow-hidden"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCourse(expandedCourse === course.code ? null : course.code)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg text-yellow-400 font-semibold">{course.code}</h4>
                    {course.notifications > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {course.notifications} new
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{course.name}</p>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedCourse === course.code ? 'rotate-180' : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Attendance: {course.attendance}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Next: {course.nextClass}</span>
                </div>
              </div>
            </div>

            {expandedCourse === course.code && (
              <div className="border-t border-gray-700 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-gray-400 font-medium mb-2">Course Details</h5>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Teacher:</span> {course.teacher}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Semester:</span> {course.semester}
                      </p>
                      <div className="text-gray-300">
                        <span className="text-gray-400">Schedule:</span>
                        {course.schedule.map((time, idx) => (
                          <p key={idx} className="ml-4 text-xs">{time}</p>
                        ))}
                      </div>
                    </div>

                    <h5 className="text-gray-400 font-medium mt-4 mb-2">Course Materials</h5>
                    <div className="space-y-2">
                      {course.materials.map((material, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-300">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-gray-400 font-medium mb-2">Progress Overview</h5>
                    <div className="space-y-3">
                      {Object.entries(course.progress).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 capitalize">{key}</span>
                            <span className="text-gray-300">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h5 className="text-gray-400 font-medium mb-2">Assignments</h5>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Total: {course.assignments.total}</span>
                          <span className="text-gray-300">Pending: {course.assignments.pending}</span>
                        </div>
                        {course.assignments.nextDue && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-400">Next Due:</span>
                            <span className="text-yellow-400 ml-2">{course.assignments.nextDue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button className="flex items-center px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm hover:bg-yellow-500">
                    <Book className="w-4 h-4 mr-2" />
                    Course Content
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Resources
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentCourses;