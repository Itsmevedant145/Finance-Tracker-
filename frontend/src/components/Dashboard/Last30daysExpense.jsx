import React, { useEffect, useState } from "react";
import { BarChart3, Calendar, TrendingDown, Activity } from "lucide-react";
import { prepareExpenseBarChartData } from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpense = ({ data }) => {
  const [chartData, setChartData] = useState(data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
    setIsLoading(false);
  }, [data]);

  // Calculate some stats
  // Calculate some stats
const totalExpenses = chartData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
const avgDaily = totalExpenses / 30;
const highestDay = chartData?.reduce((max, item) =>
  (item.amount || 0) > (max.amount || 0) ? item : max, { amount: 0 }
);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-gray-900">Last 30 Days Expenses</h5>
              <p className="text-sm text-gray-600">Daily spending analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">30 Days</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Total</span>
            </div>
            <p className="text-lg font-bold text-red-900">${totalExpenses.toFixed(2)}</p>
          </div>

          {/* Average Daily */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Daily Avg</span>
            </div>
            <p className="text-lg font-bold text-blue-900">${avgDaily.toFixed(2)}</p>
          </div>

          {/* Highest Day */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">Peak Day</span>
            </div>
            <p className="text-lg font-bold text-orange-900">${(highestDay?.expense || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-50 rounded-xl p-4 min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="text-sm text-gray-500">Loading chart data...</p>
              </div>
            </div>
          ) : chartData?.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No expense data available</p>
                <p className="text-gray-400 text-xs mt-1">Start tracking your expenses to see insights</p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <CustomBarChart data={chartData} />
            </div>
          )}
        </div>

        {/* Insights */}
        {!isLoading && chartData?.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h6 className="text-sm font-semibold text-blue-900 mb-1">Spending Insights</h6>
                <p className="text-xs text-blue-700">
                  {avgDaily > 50 
                    ? "You're spending above average. Consider reviewing your daily expenses."
                    : avgDaily > 25
                    ? "Your spending is moderate. Keep tracking to maintain good habits."
                    : "Great job keeping your daily expenses low!"
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Last30DaysExpense;