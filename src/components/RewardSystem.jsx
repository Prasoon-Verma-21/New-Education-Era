import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RewardSystem = () => {
  const [studentData, setStudentData] = useState([
    { id: 1, name: "Alice", attendance: 90, dropoutRisk: 10, coins: 50 },
    { id: 2, name: "Bob", attendance: 75, dropoutRisk: 25, coins: 30 },
    { id: 3, name: "Charlie", attendance: 60, dropoutRisk: 40, coins: 20 },
    { id: 4, name: "Diana", attendance: 85, dropoutRisk: 15, coins: 70 },
  ]);

  const shopItems = [
    { id: 1, name: "Pen", cost: 10 },
    { id: 2, name: "Book", cost: 30 },
    { id: 3, name: "T-Shirt", cost: 50 },
    { id: 4, name: "Jacket", cost: 70 },
    { id: 5, name: "Sports Equipment", cost: 100 },
  ];

  const navigate = useNavigate()

  const redeemItem = (studentId, itemCost) => {
    setStudentData((prevData) =>
      prevData.map((student) =>
        student.id === studentId && student.coins >= itemCost
          ? { ...student, coins: student.coins - itemCost }
          : student
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#3d52a0] to-[#8697c4] flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reward System</h1>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Attendance (%)</th>
              <th className="border border-gray-300 px-4 py-2">Dropout Risk (%)</th>
              <th className="border border-gray-300 px-4 py-2">Coins</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.attendance}</td>
                <td className="border border-gray-300 px-4 py-2">{student.dropoutRisk}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{student.coins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shop Section */}
      <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/shop")}
        className="px-6 py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Go to Shop
      </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shop: Redeem Your Coins</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
              <p className="text-gray-500">Cost: {item.cost} Coins</p>
              <div className="mt-2">
                {studentData.map((student) => (
                  <button
                    key={`${student.id}-${item.id}`}
                    className={`block w-full text-center mt-2 px-4 py-2 rounded-md ${
                      student.coins >= item.cost
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={student.coins < item.cost}
                    onClick={() => redeemItem(student.id, item.cost)}
                  >
                    {student.name} Redeem
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardSystem;
