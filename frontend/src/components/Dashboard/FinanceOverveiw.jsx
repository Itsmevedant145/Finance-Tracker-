import React from 'react';
import { PieChart, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import CustomPieChart from '../Charts/CustomPieChart';

const FinanceOverview = ({
  totalBalance,
  totalIncome,
  totalExpense,
}) => {
  const COLORS = ['#3B82F6', '#10B981', '#EF4444']; // blue, green, red
  
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Income", amount: totalIncome },
    { name: "Total Expense", amount: totalExpense },
  ];

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;
  const isPositive = totalIncome >= totalExpense;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="text-lg font-bold text-gray-900">Financial Overview</h5>
            <p className="text-sm text-gray-600">Your money at a glance</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Balance</span>
            </div>
            <p className="text-lg font-bold text-blue-900">${totalBalance?.toFixed(2)}</p>
          </div>

          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Income</span>
            </div>
            <p className="text-lg font-bold text-green-900">${totalIncome?.toFixed(2)}</p>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Expenses</span>
            </div>
            <p className="text-lg font-bold text-red-900">${totalExpense?.toFixed(2)}</p>
          </div>
        </div>

        {/* Savings Rate Indicator */}
        <div className={`mb-6 p-4 rounded-xl border ${
          isPositive 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Savings Rate</span>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-bold">{savingsRate}%</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(savingsRate), 100)}%` }}
            />
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-50 rounded-xl p-4">
          <CustomPieChart
            data={balanceData}
            label="Total balance"
            totalAmount={`$${totalBalance}`}
            colors={COLORS}
            showTextAnchor
          />
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {balanceData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;