// AttendanceTrendChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Labels for all months
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Sample attendance data for each month (you can replace this with real data)
const attendanceData = [75, 25, 95, 25, 35, 55, 65, 48, 92, 50, 75];

const data = {
  labels: months,
  datasets: [
    {
      label: "Attendance %",
      data: attendanceData,
      borderColor: "#3b82f6",
      backgroundColor: "#60a5fa",
      tension: 0.4,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Student Attendance Trend (Monthly)",
    },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10,
        callback: (value) => `${value}%`,
      },
    },
  },
};

export default function AttendanceTrendChart() {
  return (
    <div className="w-full max-w-xl mx-auto h-[320px]">
      <Line data={data} options={options} />
    </div>
  );
}
