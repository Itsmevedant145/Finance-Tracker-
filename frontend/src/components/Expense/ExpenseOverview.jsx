import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineCharData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [charData, setCharData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineCharData(transactions);
    setCharData(result);
    return () => {};
  }, [transactions]);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg font-semibold">Expense Overview</h5>
        <button className="add-btn flex items-center gap-1" onClick={onExpenseIncome}>
          <LuPlus className="text-base" />
          Add Expense
        </button>
      </div>
      {/* Updated paragraph with a more promotional/ad-style message */}
      <p className="text-sm text-gray-500 mb-4">
        Take control of your finances today! Track your spending, analyze trends, and make smarter decisions to save more.
      </p>
      <div className="mt-4">
        <CustomLineChart data={charData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
