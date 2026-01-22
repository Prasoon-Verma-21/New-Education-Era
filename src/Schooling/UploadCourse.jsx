import React, { useState } from "react";
import axiosInstance from "../axiosConfig";

const UploadCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCourse = { courseName, instructor, time, duration, description };

    try {
      await axiosInstance.post("/api/courses/upload", newCourse);
      alert("Course added successfully!");
      setCourseName("");
      setInstructor("");
      setTime("");
      setDuration("");
      setDescription("");
    } catch (error) {
      alert("Error adding course.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload a New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="input w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="input w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Upload Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCourse;
