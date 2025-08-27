import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors,
  showTextAnchor, // can keep this prop but won't be used now
}) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
  <Pie
    data={data}
    dataKey="amount"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={130}
    innerRadius={100}
    labelLine={false}
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
    ))}
  </Pie>
  <Tooltip content={<CustomTooltip />} />
  {/* Remove Legend here */}
</PieChart>

    </ResponsiveContainer>
  );
};

export default CustomPieChart;
