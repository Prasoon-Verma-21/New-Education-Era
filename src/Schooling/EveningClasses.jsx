import React from "react";

const EveningClasses = () => {
  return (
    <div className="pt-24 flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <h1 className="text-3xl font-bold text-gray-800">Evening Classes</h1>
      <p className="mt-4 text-lg text-gray-600">
        Join our evening classes tailored for working professionals and students.
      </p>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold">Why Choose Evening Classes?</h2>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Flexible timings to accommodate your schedule.</li>
          <li>Qualified instructors with real-world experience.</li>
          <li>Personalized learning plans to suit individual needs.</li>
        </ul>
      </div>
    </div>
  );
};

export default EveningClasses;
