import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentAttendanceGraph = ({ totalClasses, attendedClasses }) => {
  const percentage = ((attendedClasses / totalClasses) * 100).toFixed(2);

  // Data for the chart
  const data = {
    labels: ["Attended", "Missed"],
    datasets: [
      {
        label: "Attendance",
        data: [attendedClasses, totalClasses - attendedClasses],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for attended, Red for missed
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: false, // Disable automatic resizing
    maintainAspectRatio: true, // Maintain the aspect ratio
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    animation: {
      duration: 0, // Disable animation on hover
    },
  };

  return (
    <div className="p-4 shadow-md rounded-md w-full">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900 text-center">Overall Attendance</h2>
      <div className="flex flex-row items-center justify-center gap-10">
        <div className="w-44 text-gray-100">
            <Pie data={data} options={options} />
        </div>
        <p className="mt-4 text-sm text-gray-800">
            Attendance: <span className="font-bold text-gray-800">{percentage}%</span>
        </p>
      </div>
    </div>
  );
};

export default StudentAttendanceGraph;