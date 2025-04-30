import React from "react";
import { LuArrowBigRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard"; // Make sure the path is correct
import moment from "moment"; // Import moment.js for date formatting

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h5 className="text-lg font-semibold text-gray-800">Expenses</h5>
        <button
          onClick={onSeeMore}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          See All <LuArrowBigRight className="text-base" />
        </button>
      </div>

      {/* Expense list */}
      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("MMM Do YYYY")}
            amount={expense.amount}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
