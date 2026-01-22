import React from "react";

const PartTimePrograms = () => {
  return (
    <div className="pt-24 flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-green-100 to-green-300">
      <h1 className="text-3xl font-bold text-gray-800">Part-Time Programs</h1>
      <p className="mt-4 text-lg text-gray-600">
        Explore our part-time programs designed to fit your schedule.
      </p>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold">Features of Part-Time Programs</h2>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Evening and weekend classes available.</li>
          <li>Diverse course selection based on industry needs.</li>
          <li>Supportive learning environment for all students.</li>
        </ul>
      </div>
    </div>
  );
};

export default PartTimePrograms;
