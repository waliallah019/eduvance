interface Result {
    rollNumber: string;
    studentName: string;
    courseCode: string;
    courseName: string;
    creditHours: number;
    grade: string;
    semester: string;
  }
  
  const results: Result[] = [
    {
      rollNumber: "FA21-BCS-001",
      studentName: "Ahmed Ali",
      courseCode: "SE-441",
      courseName: "Software Project Management A",
      creditHours: 3,
      grade: "A",
      semester: "SPRING 2025",
    },
    {
      rollNumber: "FA21-BCS-001",
      studentName: "Ahmed Ali",
      courseCode: "CS-483",
      courseName: "Cloud Computing A",
      creditHours: 3,
      grade: "B+",
      semester: "SPRING 2025",
    },
    {
      rollNumber: "FA21-BCS-001",
      studentName: "Ahmed Ali",
      courseCode: "QT-301",
      courseName: "Translation of the Holy Quran - III B",
      creditHours: 2,
      grade: "A+",
      semester: "SPRING 2025",
    },
    {
      rollNumber: "FA21-BCS-001",
      studentName: "Ahmed Ali",
      courseCode: "CS-372",
      courseName: "Parallel and Distributed Computing B",
      creditHours: 3,
      grade: "B",
      semester: "SPRING 2025",
    },
  ];
  
  const StudentResults = () => {
    return (
      <div className="bg-[#29293d] p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-yellow-400 text-center mb-6">Student Results</h3>
  
        {/* Display Roll Number and Student Name at the top */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 text-sm mb-6 flex justify-between items-center">
            <p className="text-gray-300">
                <strong className="text-yellow-400">Student Name:</strong> {results[0].studentName}
            </p>
            <p className="text-gray-300">
                <strong className="text-yellow-400">Roll Number:</strong> {results[0].rollNumber}
            </p>
        </div>
        <div className="max-h-[500px] overflow-y-auto p-2 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 text-sm transition-all"
              >
                <h4 className="text-lg text-yellow-400 font-semibold mb-2">
                  {result.courseCode} - {result.courseName}
                </h4>
                <p className="text-gray-300"><strong>Credit Hours:</strong> {result.creditHours}</p>
                <p className="text-gray-300"><strong>Grade:</strong> {result.grade}</p>
                <p className="text-gray-300"><strong>Semester:</strong> {result.semester}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default StudentResults;
  