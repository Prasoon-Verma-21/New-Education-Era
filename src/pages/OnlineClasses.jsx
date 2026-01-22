import React from 'react';

const OnlineClasses = () => {
  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Online Classes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Live Sessions</h2>
          <p className="text-gray-600">Join interactive live sessions with experts.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Pre-Recorded Lectures</h2>
          <p className="text-gray-600">Access recorded lectures at any time.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Workshops</h2>
          <p className="text-gray-600">Enroll in specialized workshops to enhance your skills.</p>
        </div>
      </div>
    </div>
  );
};

export default OnlineClasses;
