import React from 'react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name } = payload[0].payload;
    const value = payload[0].value;

    return (
      <div className="bg-white shadow-md rounded-md p-4 border border-gray-200 text-sm">
        <h4 className="text-gray-800 font-semibold mb-1">{name}</h4>
        <p className="text-gray-600">
          <span className="font-medium text-gray-500">Amount: </span>
          <span className="font-bold text-green-600 text-base">{`$${value}`}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
