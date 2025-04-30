import React from 'react';
import CustomPieChart from '../Charts/CustomPieChart';  // Correctly import the chart from the Charts folder
//import './FinanceOverview.css';

const FinanceOverview = ({
  totalBalance,
  totalIncome,
  totalExpense,
}) => {

  const COLORS = ['#60A5FA', '#10B981', '#EF4444']; // light blue, green, red

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Income", amount: totalIncome },
    { name: "Total Expense", amount: totalExpense },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-lg font-semibold text-gray-800">Financial Overview</h5>
      </div>
      
      <CustomPieChart
        data={balanceData}
        label="Total balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
