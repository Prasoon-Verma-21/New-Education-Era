import React from 'react';

const Card = () => {
  return (
    <div className="w-[50vw] p-6 bg-green-100 shadow-lg rounded-lg border border-gray-200 flex items-center space-x-4 transform transition-transform duration-300 hover:scale-105">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 py-1 inline-block rounded-md">
          Search engine optimization
        </h2>
        <ul className="mt-4 text-lg text-gray-600 list-disc list-inside">
          <li>Increase website visibility on search engines</li>
          <li>Improve organic traffic and rankings</li>
          <li>Analyze and optimize keywords</li>
          <li>Enhance user experience for better engagement</li>
        </ul>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-black/10 rounded-full">
            <span className="text-xl">&#8594;</span>
          </div>
          <p className="text-sm text-gray-500">Learn more</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <img
          src="https://via.placeholder.com/100"
          alt="SEO Illustration"
          className="w-28 h-28 rounded-lg object-cover shadow-md"
        />
      </div>
    </div>
  );
};

export default Card;
