import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/courses/available");
        setCourses(response.data);
      } catch (error) {
        alert("Error fetching courses");
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = (courseId) => {
    // Handle enroll logic here
    alert(`Enrolled in course with ID: ${courseId}`);
  };

  return (
    <div>
    <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course._id}
            className="course-card bg-white p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.courseName}</h3>
            <p className="text-sm text-gray-600 mb-1">Instructor: {course.instructor}</p>
            <p className="text-sm text-gray-600 mb-1">Time: {course.time}</p>
            <p className="text-sm text-gray-600 mb-1">Duration: {course.duration}</p>
            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
            <button
              onClick={() => handleEnroll(course._id)}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Enroll Now
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No courses available at the moment.</p>
      )}
    </div>
  </div>
  );
};

export default AvailableCourses;
