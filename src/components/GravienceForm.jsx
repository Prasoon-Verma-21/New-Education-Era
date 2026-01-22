import React, { useState } from "react";
import image from '../assets/greivance.jpg'
import axiosInstance from "../axiosConfig";

const StudentGrievanceForm = () => {
  // State variables for form data
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [otherComplaint, setOtherComplaint] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Prepare the form data
    const formData = {
      studentName,
      course,
      className,
      complaintType: complaintType === "Other" ? otherComplaint : complaintType,
      message,
    };

    try {
      // Make the API call
      const response = await axiosInstance.post("/api/complaint/student", formData);
      alert("Complaint submitted successfully!");
      console.log(response.data);

      // Reset the form after submission
      setStudentName("");
      setCourse("");
      setClassName("");
      setComplaintType("");
      setOtherComplaint("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-evenly px-4">
      <div className="relative">
        <img className="w-[100vw] h-[100vh] opacity-65" src={image} alt="" />
        <h1 className="text-5xl absolute top-64 left-44 font-semibold text-gray-700 p-5 bg-gradient-to-b from-white via-gray-100 to-gray-200 rounded-xl mb-6 text-center">
          Student Grievance Form
        </h1>
      </div>
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Student Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name of the Student</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
              placeholder="Enter your name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          {/* Course Enrolled */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Course Enrolled</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
              placeholder="Enter your course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Class</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
              placeholder="Enter your class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          {/* Type of Complaint */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Type of Complaint</label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a complaint type
              </option>
              <option value="Teacher Misconduct">Teacher Misconduct</option>
              <option value="Administration Issue">Administration Issue</option>
              <option value="Facilities Issue">Facilities Issue</option>
              <option value="Other">Other</option>
            </select>

            {complaintType === "Other" && (
              <div className="mt-3">
                <label className="block text-gray-700 font-medium mb-2">Specify Complaint</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
                  placeholder="Enter your complaint type"
                  value={otherComplaint}
                  onChange={(e) => setOtherComplaint(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Message Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
              rows={4}
              placeholder="Write your complaint here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentGrievanceForm;
