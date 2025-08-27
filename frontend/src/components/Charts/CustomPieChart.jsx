import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors,
}) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', fontSize: '14px' }}>No data available</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <ResponsiveContainer
        width="100%"
        height={window.innerWidth < 480 ? 220 : 300} // smaller height on mobile
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={window.innerWidth < 480 ? 80 : 130}
            innerRadius={window.innerWidth < 480 ? 60 : 100}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
