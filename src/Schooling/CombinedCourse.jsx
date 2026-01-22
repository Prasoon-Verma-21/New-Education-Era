import React, { useState } from "react";
import AvailableCourses from "./AvailableCourses"; 

const CombinedPage = () => {
  const [activeTab, setActiveTab] = useState("available"); 
  return (
    <div className="container mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="tabs flex space-x-4 mb-6">
        <button
          className={`tab px-4 py-2 text-lg font-semibold rounded-tl-lg ${
            activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Course
        </button>
        <button
          className={`tab px-4 py-2 text-lg font-semibold rounded-tr-lg ${
            activeTab === "available" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("enrolled")}
        >
          Enrolled Courses
        </button>
      </div>

      {/* Tabs Content */}
      {activeTab === "available" ? (
        <div>
          <AvailableCourses /> {/* Renders the AvailableCourses component */}
        </div>
      ) : (
        <div>
          <h1>List of enrolled courses, coming soon.........</h1>
        </div>
      )}
    </div>
  );
};

export default CombinedPage;
