import React from 'react';
// import { LucideIcon } from 'lucide-react';


const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <Icon className="w-10 h-10 opacity-80" />
      </div>
      <button className="mt-4 text-sm hover:underline flex items-center">
        More info
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default StatCard;