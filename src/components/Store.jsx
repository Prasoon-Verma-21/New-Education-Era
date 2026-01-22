import React from "react";

const Store = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Rewards System</h1>
          <div className="text-yellow-400 font-semibold">Your Points: 1444</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Reward Store</h2>
          <p className="text-gray-600">Redeem rewards for your achievements</p>
        </div>

        {/* Reward Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example reward items */}
          {[
            {
              title: "Time Travel Ticket",
              description: "Finish 1 Missing Challenge",
              cost: 70,
            },
            {
              title: "Premium Subscription",
              description: "30-Day Premium Access",
              cost: 6000,
            },
            {
              title: "Free T-Shirt",
              description: "Exclusive LeetCode T-Shirt",
              cost: 7200,
            },
            {
              title: "Cap",
              description: "LeetCode Cap",
              cost: 4500,
            },
            {
              title: "Exclusive Kit",
              description: "Includes Cap and Keychain",
              cost: 9400,
            },
            {
              title: "Laptop Sleeve",
              description: "Protective Laptop Sleeve",
              cost: 9200,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 mb-5 shadow-xl border-t border-l border-r border-b-[3px] border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer shadow-blue-300 rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="text-yellow-500 font-bold text-lg mb-4">
                {item.cost} Points
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Redeem
              </button>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
};

export default Store;