import React, { useState } from "react";

const StudentAdminDashboard = () => {
  const studentData = {
    "Odisha Govt High School": {
      "Class 10-A": {
        "Rahul Kumar": {
          image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
          class: "Class 10-A",
          attendance: 62,
          distance: "7.5 km",
          dropoutRisk: 78,
          subjects: { Maths: 45, Science: 52, English: 58, Social: 60 },
          parentJob: "Daily Wage Laborer",
          location: "Rural Rayagada"
        },
        "Priya Das": {
          image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
          class: "Class 10-A",
          attendance: 94,
          distance: "1.2 km",
          dropoutRisk: 12,
          subjects: { Maths: 88, Science: 91, English: 85, Social: 89 },
          parentJob: "Teacher",
          location: "Urban Bhubaneswar"
        }
      }
    },
    "Bihar Secondary School": {
      "Class 9-B": {
        "Amit Manjhi": {
          image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
          class: "Class 9-B",
          attendance: 71,
          distance: "5.0 km",
          dropoutRisk: 65,
          subjects: { Maths: 40, Science: 38, English: 45, Social: 50 },
          parentJob: "Agriculture",
          location: "Rural Gaya"
        }
      }
    }
  };

  // 1. Define State First
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);

  // 2. Define Corrected Handlers
  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    setSelectedClass(""); // Reset class
    setSelectedStudent(""); // Reset student
    setCurrentStudent(null); // Hide card
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent(""); // Reset student
    setCurrentStudent(null); // Hide card
  };

  const handleStudentChange = (e) => {
    const studentName = e.target.value;
    setSelectedStudent(studentName);
    if (studentName) {
      setCurrentStudent(studentData[selectedSchool][selectedClass][studentName]);
    } else {
      setCurrentStudent(null);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Student Risk Monitoring Portal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Filter by Region</h2>
            <div className="space-y-4">
              {/* Linked to handleSchoolChange */}
              <select className="w-full p-2 border rounded" value={selectedSchool} onChange={handleSchoolChange}>
                <option value="">Select School</option>
                {Object.keys(studentData).map(school => <option key={school} value={school}>{school}</option>)}
              </select>

              {/* Linked to handleClassChange */}
              <select className="w-full p-2 border rounded" disabled={!selectedSchool} value={selectedClass} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {selectedSchool && Object.keys(studentData[selectedSchool]).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Linked to handleStudentChange */}
              <select className="w-full p-2 border rounded" disabled={!selectedClass} value={selectedStudent} onChange={handleStudentChange}>
                <option value="">Select Student</option>
                {selectedClass && Object.keys(studentData[selectedSchool][selectedClass]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {currentStudent ? (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img className="w-20 h-20 rounded-full border-4 border-blue-100" src={currentStudent.image} alt="avatar" />
                  <div>
                    <h3 className="text-xl font-bold">{selectedStudent}</h3>
                    <p className="text-gray-500">{currentStudent.class}</p>
                    <p className="text-sm text-blue-600 font-medium">{currentStudent.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p className="text-2xl font-bold text-blue-600">{currentStudent.attendance}%</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Commute</p>
                      <p className="text-2xl font-bold text-purple-600">{currentStudent.distance}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Family Background</p>
                    <p className="text-gray-800">Occupation: {currentStudent.parentJob}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <h2 className="text-xl font-semibold mb-6">AI Dropout Risk Prediction</h2>
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${currentStudent.dropoutRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
                      {currentStudent.dropoutRisk}%
                    </span>
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={440} strokeDashoffset={440 - (440 * currentStudent.dropoutRisk) / 100}
                      className={currentStudent.dropoutRisk > 50 ? 'text-red-500' : 'text-green-500'} />
                  </svg>
                </div>
                <p className="font-medium text-gray-600">
                  Status: {currentStudent.dropoutRisk > 60 ? "CRITICAL INTERVENTION NEEDED" : "STABLE"}
                </p>
              </div>
            </>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-10 flex items-center justify-center text-gray-400 border-2 border-dashed">
              Select a student to view regional risk metrics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAdminDashboard;