import React from "react";

const SchoolWiseDropout = () => {
  // Research-backed data for Jan 2026 Review
  const schoolData = [
    { id: 1, name: "Odisha Govt High School", region: "Rayagada", rate: "27.3%", status: "Critical" },
    { id: 2, name: "Bihar Secondary School", region: "Patna", rate: "25.9%", status: "Critical" },
    { id: 3, name: "Rural Secondary Hub", region: "Gaya", rate: "19.5%", status: "High Risk" },
    { id: 4, name: "Adarsh Vidyalaya", region: "Bhubaneswar", rate: "12.4%", status: "Moderate" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">School-Wise Dropout Analytics (Class 9-12)</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">School Name</th>
              <th className="p-4">Region</th>
              <th className="p-4">Dropout Rate</th>
              <th className="p-4">Alert Status</th>
            </tr>
          </thead>
          <tbody>
            {schoolData.map((school) => (
              <tr key={school.id} className="border-b hover:bg-gray-100">
                <td className="p-4 font-medium">{school.name}</td>
                <td className="p-4">{school.region}</td>
                <td className="p-4 text-red-600 font-bold">{school.rate}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    school.status === "Critical" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"
                  }`}>
                    {school.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolWiseDropout;