import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgressDashboard = ({ username }) => {
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [attendance, setAttendance] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState("");
  const [gradeSubject, setGradeSubject] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const [activeTab, setActiveTab] = useState("progress"); // Default to Progress tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Student Data
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentResponse = await axios.get(`/api/student/${username}`);
        setStudent(studentResponse.data);
        const progressResponse = await axios.get(`/api/progress/${studentResponse.data._id}`);
        if (Array.isArray(progressResponse.data)) {
          setProgress(progressResponse.data);
        } else {
          setProgress([]); // Fallback to empty array if data is not an array
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [username]);

  // Handle Tab Change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle Attendance Update
  const updateAttendance = async () => {
    try {
      await axios.post(`/api/attendance/${student._id}`, { attendance });
      alert("Attendance updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    }
  };

  // Handle Assignment Addition
  const addAssignment = async () => {
    try {
      await axios.post(`/api/assignments/${student._id}`, { title: assignmentTitle, details: assignmentDetails });
      alert("Assignment added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add assignment");
    }
  };

  // Handle Grade Update
  const updateGrade = async () => {
    try {
      await axios.post(`/api/grades/${student._id}`, { subject: gradeSubject, grade: gradeValue });
      alert("Grade updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update grade");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">Student Dashboard</h2>

      {/* Tab Navigation */}
      <div className="tabs flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "progress" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("progress")}
        >
          Progress Dashboard
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "attendance" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("attendance")}
        >
          Update Attendance
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "assignments" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("assignments")}
        >
          Add Assignment
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "grades" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("grades")}
        >
          Update Grades
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "progress" && (
        <div className="progress-tab">
          <h3 className="font-bold text-lg">Progress Dashboard</h3>
          {progress.length > 0 ? (
            <ul>
              {progress.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold">{item.subject}</span>: {item.grade}
                </li>
              ))}
            </ul>
          ) : (
            <p>No progress data available.</p>
          )}
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="attendance-tab">
          <h3 className="font-bold text-lg">Update Attendance</h3>
          <form onSubmit={(e) => { e.preventDefault(); updateAttendance(); }}>
            <input
              type="date"
              className="border p-2 mb-2"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Update Attendance</button>
          </form>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="assignments-tab">
          <h3 className="font-bold text-lg">Add Assignment</h3>
          <form onSubmit={(e) => { e.preventDefault(); addAssignment(); }}>
            <input
              type="text"
              className="border p-2 mb-2"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
            />
            <textarea
              className="border p-2 mb-2"
              placeholder="Assignment Details"
              value={assignmentDetails}
              onChange={(e) => setAssignmentDetails(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Add Assignment</button>
          </form>
        </div>
      )}

      {activeTab === "grades" && (
        <div className="grades-tab">
          <h3 className="font-bold text-lg">Update Grades</h3>
          <form onSubmit={(e) => { e.preventDefault(); updateGrade(); }}>
            <input
              type="text"
              className="border p-2 mb-2"
              placeholder="Subject"
              value={gradeSubject}
              onChange={(e) => setGradeSubject(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 mb-2"
              placeholder="Grade"
              value={gradeValue}
              onChange={(e) => setGradeValue(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Update Grade</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
