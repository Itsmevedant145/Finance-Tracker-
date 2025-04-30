import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Assuming CustomTooltip is already defined elsewhere
import CustomTooltip from './CustomTooltip';

const CustomBarChart = ({ data }) => {
  // Use the provided data (or fallback to an empty array if no data is provided)
  const chartData = data;

  // Helper function to get different bar colors based on the index
  const getBarColor = (index) => {
    return index % 2 === 0 ? '#FF8042' : '#00C49F'; // Alternate colors
  };

  // Custom tooltip content component
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 p-2 rounded shadow-lg">
          <p className="text-sm text-gray-700">{`Month: ${payload[0].payload.month}`}</p>
          <p className="text-sm text-gray-700">{`Amount: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="none" />
          
          {/* Corrected the dataKey to 'month' */}
          <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} stroke="none" />
          
          <YAxis tick={{ fill: '#555', fontSize: 12 }} stroke="none" />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: 'blue' }}
            activeStyle={{ fill: 'green' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
