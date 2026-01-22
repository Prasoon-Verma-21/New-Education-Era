import React, { useState } from 'react';


export const ChartTabs= ({ children }) => {
  const [activeTab, setActiveTab] = useState('Area');

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
          <h3 className="font-medium">MonthWise Dropouts</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('Area')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Area'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setActiveTab('Donut')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Donut'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Donut
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartTabs;