import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";
// import "./Last30daysExpense.css"; // Assuming you have a CSS file, uncomment if needed

const Last30DaysExpense = ({ data }) => {
  const [chartData, setChartData] = useState(data);
  
  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-lg font-semibold text-gray-800">Last 30 Days Expenses</h5>
      </div>
      {/* Bar chart component */}
      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpense;
