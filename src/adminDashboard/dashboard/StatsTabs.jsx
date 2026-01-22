import React, { useState } from 'react';

const StatsTabs= () => {
  const [activeTab, setActiveTab] = useState('Visitors');

  const tabs = ['Visitors', 'Online', 'Dropouts'];

  return (
    <div className="flex space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-3 px-6 rounded-lg text-center transition-colors ${
            activeTab === tab
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default StatsTabs;