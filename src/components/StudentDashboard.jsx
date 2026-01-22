import React, { useState, useEffect } from "react";
import user from "../assets/Expert1.jpg";
import StudentAttendanceGraph from "./AttendaceChart";
import axios from "axios";
import axiosInstance from "../axiosConfig";
import studentimg from '../../public/self-growth.png'
import { ArrowBigRight, Award, BookOpenText, CircleArrowRight, CircleUser, LibraryBig, ListOrdered, School } from "lucide-react";
import AttendanceTrendChart from "./AttendanceTrendChart";


const StudentDashboard = () => {
  const [aiScore, setAiScore] = useState(0.8);
  const [userData, setUserData] = useState('');

  // Data to send to the API
  const studentData = {
    last_percentage: 35.0, // Example: Academic performance percentage
    attendance: 29.0,      // Example: Attendance percentage
    parents_qualification: "Primary", // Example: Parent's qualification level
    area: "Urban",         // Example: Residential area ('Urban' or 'Rural')
    num_teachers: 5,       // Example: Teachers per 50 students
    income: 50000.0        // Example: Monthly family income in INR
  };

  // Fetch AI Score and send student data when the component is mounted
  useEffect(() => {
    const fetchAiScore = async () => {
      try {
        // Create a new FormData object
        const formData = new FormData();
        formData.append("last_percentage", studentData.last_percentage);
        formData.append("attendance", studentData.attendance);
        formData.append("parents_qualification", studentData.parents_qualification);
        formData.append("area", studentData.area);
        formData.append("num_teachers", studentData.num_teachers);
        formData.append("income", studentData.income);

        // Make a POST request with the FormData object
        const response = await axios.post("http://localhost:8000/api/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Handle the response
        if (response.data && response.data.dropout_probability !== undefined) {
          setAiScore(response.data.dropout_probability); // Update with the dropout probability
        } else {
          console.error("Error fetching AI score: No valid data received");
        }
      } catch (error) {
        console.error("Error fetching AI score:", error.response?.data || error.message);
      }
    };

    fetchAiScore();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get('/api/student/studentData');
        setUserData(response.data.data);
        console.log("student data",userData);
      } catch (error) {
        console.error("Error fetching AI score:", error.response?.data || error.message);
      }
    };

    fetchStudentData();
  }, []);

  console.log("student data", userData);

  const handleBackToLearning = () => {
    window.location.href = "/learning-hub";
  };

  const Marks = [
    { subject: "Hindi", marks: "33" },
    { subject: "English", marks: "30" },
    { subject: "Math", marks: "15" },
    { subject: "Science", marks: "38" },
    { subject: "Social Science", marks: "45" },
    { subject: "Computer", marks: "12" },
  ];

  const attendance = {
    totalClasses: 100,
    attendedClasses: 40,
  };

  const Enrolled = [
    { name: "React Basics", status: "Pending" },
    { name: "Advanced CSS", status: "Pending" },
    { name: "JavaScript Mastery", status: "Completed" },
    { name: "Python for Beginners", status: "Completed" },
  ];

  const courses = [
    { name: "React Basics", progress: 35 },
    { name: "Advanced CSS", progress: 50 },
    { name: "JavaScript Mastery", progress: 80 },
    { name: "Tailwind CSS", progress: 30 },
  ];

  return (
    <div className="flex flex-col relative items-center bg-blue-50 min-h-screen p-14">
      
      <div className="absolute ml-[63%] top-4">
          <img src={studentimg} draggable={false} className="h-60 mb-10 w-60" />
        </div>
        <div className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl">
        {/* Left Section */}
        <div className="lg:w-1/3 bg-blue-500 shadow-xl rounded-xl p-6 text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <img
              src={userData?.profilePicture || user}
              alt="User"
              className="h-28 w-28 rounded-full object-cover mb-4 border-4 border-white"
            />
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-sm">Class : {userData.Class}</p>
            <button
              onClick={handleBackToLearning}
              className="mt-4 px-4 py-2 flex flex-row items-center gap-2 bg-gray-200 text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              <ArrowBigRight className="rotate-180" />  Back to Learning
            </button>
          </div>
          <hr className="my-6 border-gray-300" />
          {/* Info Section */}
          <div className="text-lg space-y-2">
            <p>
              <span className="font-semibold flex flex-row items-center"><Award className="text-yellow-400" />Batch: 2024-2025</span> 
            </p>
            <p>
              <span className="font-semibold flex flex-row items-center gap-1"><School className="text-rose-400" />  School: {userData.school}</span> 
            </p>
            <p>
              <span className="font-semibold flex flex-row items-center gap-1"><ListOrdered /> Roll No: {userData.rollNo}</span> 
            </p>
            <p>
              <span className="font-semibold flex flex-row items-center gap-1"><CircleUser className="text-blue-900" /> Contact: {userData.phone}</span> 
            </p>
          </div>
          <hr className="my-6 border-gray-300" />
          <hr className="my-6 border-gray-300" />
          <hr className="my-6 border-gray-300" />
          {/* Achievements Section */}
          <h3 className="text-xl font-bold mb-4 text-center">Achievements</h3>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-12 bg-white rounded-full hover:scale-105 transition transform duration-200 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden"
              >
                {i === 0 ? (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQROEjC3IRzGwdrGwSVGZvPjLMe2_bwUb0pCqd3E3r8jWZraOtL88xCRuPKLSe_lU1-0Xc&usqp=CAU"
                    alt="Badge 1"
                    className="h-full w-full object-cover"
                  />
                ) : i === 2 ? (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRwHFTezTl5wgYbXL2sLLJUaUJw02QV73FNA&s"
                    alt="Badge 2"
                    className="h-full w-full object-cover"
                  />
                ) : i === 4 ? (
                  <img
                    src="https://img.freepik.com/free-psd/elegant-badge-isolated_23-2150997696.jpg"
                    alt="Badge 3"
                    className="h-full w-full object-cover"
                  />
                ) : i < 6 ? (
                  <img
                    src="https://png.pngtree.com/png-clipart/20190604/original/pngtree-badge-png-image_996483.jpg"
                    alt={`Achievement badge ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>
          </div>

        {/* Right Section */}
        <div className="lg:w-2/3 flex flex-col gap-10">

           {/* AI-Driven Score Section */}
          <div className="shadow-lg flex flex-row rounded-xl bg-[#d8efff] h-52 p-10">
            <div className="w-[45%]">
            <h3 className="text-2xl font-semibold mb-2 text-blue-600">Hello {userData && userData?.username},</h3>
            <p className="text-left text-gray-800 text-sm mb-2">Here is your Dropout score keep it as low as possible otherwise notice will be sent to your parents</p>
            <div className="relative">
              {aiScore !== null ? (
                <div className="space-y-1">
                  {/* AI Score */}
                  <div className="text-left text-lg p-1 font-bold text-blue-900">
                    Dropout Rate - {aiScore*10} / 10
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    
                    <div className="flex mb-4 items-center justify-between">
                      <div className="flex flex-row gap-1 items-center w-full">
                        <span>0</span>
                        <div className="w-full bg-gray-500 rounded-lg">
                        <div
                          className={`transition-all duration-500 ease-in-out h-2 rounded-lg ${
                            aiScore*10 >= 8
                              ? "bg-green-400"
                              : aiScore*10 >= 5
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${(aiScore*10 / 10) * 100}%` }}
                        ></div>
                        </div>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">Loading...</div>
              )}
            </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-gray-100 border-t-2 border-gray-200 border-x-2 shadow-xl rounded-xl">
              <h1 className="p-5 ml-5 font-semibold text-2xl text-blue-600">Attendance Overview...</h1>
              <AttendanceTrendChart />
              <StudentAttendanceGraph
                totalClasses={attendance.totalClasses}
                attendedClasses={attendance.attendedClasses}
              />
            </div>
          </div>

          {/* My Courses */}
          <div className="flex md:flex-row flex-col gap-6 w-full">
            <div className="bg-white w-full shadow-xl rounded-xl p-6">
              <h3 className="text-xl flex flex-row items-center gap-2 font-semibold mb-5 text-blue-600">
                <BookOpenText className="text-lg" />  Ongoing Courses...
              </h3>
              {courses.map((course, index) => (
                <div key={index} className="mb-4 bg-blue-100 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-[16px] text-gray-800">
                      {course.name}
                    </span>
                    <div className="flex flex-row gap-5">
                      <span title="view" className="px-2 flex flex-row items-center gap-1 rounded-md  text-gray-800 hover:text-blue-600 cursor-pointer"><CircleArrowRight className="h-6 w-6" /></span>
                    </div>
                  </div>
                  <div title={`${course.progress}%`} className="w-full cursor-pointer bg-gray-400 h-2 rounded-lg">
                    <div
                      className="bg-blue-500 h-2 rounded-lg"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          {/* Enrolled Courses */}
            <div className="bg-white w-full shadow-xl rounded-xl p-6">
              <h3 className="text-xl flex flex-row items-center gap-2 font-semibold mb-5 text-blue-600">
                <LibraryBig className="text-lg" />  Enrolled Courses
              </h3>
              <div className="space-y-4">
                {Enrolled.map((course, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-blue-100 p-3 rounded-lg"
                  >
                    <span className="text-gray-800 text-[16px] font-medium">
                      {course.name}
                    </span>
                    <span
                      className={`font-bold flex flex-row cursor-pointer gap-2 items-center ${
                        course.status === "Completed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {course.status}
                      <CircleArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
