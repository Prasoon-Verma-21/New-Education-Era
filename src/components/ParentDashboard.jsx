import React, { useState } from "react";
import parentImage from "../assets/tutor1.jpg"; 

const ParentDashboard = () => {
  const handleBackToLearning = () => {
    window.location.href = "/learning-hub";
  };

  // Dummy data for parent and children details
  const parentDetails = {
    username: "sophiamartin",
    name: "Sophia Martin",
    email: "sophia.martin@example.com",
    phone: "+91 9876543210",
    address: "123, Maple Street, City Name, Country",
    children: [
      {
        name: "Liam Martin",
        grade: "Grade 5",
        school: "Sunshine International School",
        classTeacher: "Ms. Jane Doe",
        attendance: "95%",
        lastExamMarks: "90%",
        performance: "Excellent",
        subjects: [
          { name: "Math", marks: 95 },
          { name: "Science", marks: 85 },
          { name: "English", marks: 90 },
        ],
      },
      {
        name: "Olivia Martin",
        grade: "Grade 3",
        school: "Sunshine International School",
        classTeacher: "Mr. John Smith",
        attendance: "89%",
        lastExamMarks: "80%",
        performance: "Good",
        subjects: [
          { name: "Math", marks: 80 },
          { name: "Science", marks: 75 },
          { name: "English", marks: 85 },
        ],
      },
    ],
  };

  // Dummy chat data for the teacher
  const [chatMessages, setChatMessages] = useState([
    { sender: "Teacher", message: "Hello Sophia, how is Liam doing?" },
    { sender: "Parent", message: "He is doing well, thank you!" },
  ]);
  const [newMessage, setNewMessage] = useState(""); // State for the new message input

  // Handle sending the message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([
        ...chatMessages,
        { sender: "Parent", message: newMessage }, // Add the new message
      ]);
      setNewMessage(""); // Clear the input field
    }
  };

  const [activeTab, setActiveTab] = useState("children");

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-500 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-6 animate-pulse">
        Welcome, Sophia Martin!
      </h1>
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl">
        {/* Left Section: Profile */}
        <div className="lg:w-1/3 bg-gradient-to-b from-indigo-600 to-indigo-800 shadow-xl rounded-xl p-6 text-white">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <img
              src={parentImage}
              alt="Parent"
              className="h-28 w-28 rounded-full object-cover mb-4 border-4 border-white"
            />
            <h2 className="text-2xl font-semibold">{parentDetails.name}</h2>
            <p className="text-sm">Parent of {parentDetails.children.length} children</p>
            <button
              onClick={handleBackToLearning}
              className="mt-4 px-4 py-2 bg-white text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
            >
              Back to Learning
            </button>
          </div>
          <hr className="my-6 border-gray-300" />
          {/* Full Profile Details Section */}
          <div className="text-lg space-y-2">
            <p><span className="font-semibold">Username:</span> {parentDetails.username}</p>
            <p><span className="font-semibold">Email:</span> {parentDetails.email}</p>
            <p><span className="font-semibold">Phone:</span> {parentDetails.phone}</p>
            <p><span className="font-semibold">Address:</span> {parentDetails.address}</p>
          </div>
        </div>

        {/* Right Section: Booking Details and Child Information */}
        <div className="lg:w-2/3 bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-900">Child's Details</h3>

          {/* Tabs */}
          <div className="mb-4">
            <button
              onClick={() => setActiveTab("children")}
              className={`px-4 py-2 rounded-l-lg ${activeTab === "children" ? "bg-indigo-900 text-white" : "bg-gray-200 text-indigo-900"} mr-2`}
            >
              Children Details
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-r-lg ${activeTab === "chat" ? "bg-indigo-900 text-white" : "bg-gray-200 text-indigo-900"}`}
            >
              Chat with Teacher
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "children" ? (
            <div className="space-y-4">
              {parentDetails.children.map((child, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h4 className="text-xl font-semibold text-indigo-900">{child.name}</h4>
                  <p><span className="font-semibold">Grade:</span> {child.grade}</p>
                  <p><span className="font-semibold">School:</span> {child.school}</p>
                  <p><span className="font-semibold">Class Teacher:</span> {child.classTeacher}</p>
                  <p><span className="font-semibold">Attendance:</span> {child.attendance}</p>
                  <p><span className="font-semibold">Last Exam Marks:</span> {child.lastExamMarks}</p>
                  <p><span className="font-semibold">Performance:</span> {child.performance}</p>

                  {/* Child's Subjects and Marks */}
                  <h5 className="mt-4 font-semibold text-indigo-900">Subjects</h5>
                  <div className="space-y-2">
                    {child.subjects.map((subject, idx) => (
                      <p key={idx}>
                        <span className="font-semibold">{subject.name}: </span>{subject.marks}%
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "Parent" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg ${msg.sender === "Parent" ? "bg-indigo-900 text-white" : "bg-gray-200 text-indigo-900"}`}
                  >
                    <p>{msg.sender}:</p>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-3/4 p-2 rounded-lg bg-gray-200 text-indigo-900"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-1/4 bg-indigo-900 text-white p-2 rounded-lg ml-2"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
