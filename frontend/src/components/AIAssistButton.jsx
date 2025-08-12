import React from 'react';

const AIAssistButton = ({ onClick }) => {
  return (
    <div className="relative inline-block group">
      <button
        type="button"
        onClick={onClick} // This will open modal in Navbar
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        💡 AI Assist
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-sm text-center rounded-md py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        Use AI to quickly add income or expense
      </div>
    </div>
  );
};

export default AIAssistButton;
