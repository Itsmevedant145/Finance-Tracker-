import React, { useState, useEffect } from "react";
import { PieChart, TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#8B5CF6", "#EF4444", "#F97316", "#6366F1"];

const RecentIncomeWithCharts = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Prepare the chart data based on the incoming data
  const prepareChartData = () => {
    if (!data || data.length === 0) {
      setIsLoading(false);
      return;
    }

    const dataArr = data.map((item) => ({
      name: item?.source?.includes('@') ? 'Other Income' : item?.source || 'Income',
      amount: item?.amount,
    }));

    // Group by source and sum amounts
    const groupedData = dataArr.reduce((acc, item) => {
      const existing = acc.find(x => x.name === item.name);
      if (existing) {
        existing.amount += item.amount;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

    // Sort by amount (highest first)
    const sortedData = groupedData.sort((a, b) => b.amount - a.amount);

    if (sortedData.length > 0) {
      setChartData(sortedData);
    }
    
    setIsLoading(false);
    console.log("Prepared chart data:", sortedData);
  };

  // Effect hook to prepare chart data when `data` changes
  useEffect(() => {
    setIsLoading(true);
    prepareChartData();
  }, [data]);

  // Calculate additional stats
  const topSource = chartData[0];
  const sourceCount = chartData.length;
  const avgPerSource = sourceCount > 0 ? totalIncome / sourceCount : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-gray-900">Income Distribution</h5>
              <p className="text-sm text-gray-600">Last 60 days breakdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">60 Days</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Total Income */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Total</span>
            </div>
            <p className="text-lg font-bold text-green-900">${totalIncome?.toFixed(2)}</p>
          </div>

          {/* Top Source */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Top Source</span>
            </div>
            <p className="text-lg font-bold text-purple-900 truncate">
              {topSource?.name || 'N/A'}
            </p>
          </div>

          {/* Sources Count */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Sources</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{sourceCount}</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-50 rounded-xl p-6 min-h-[350px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="text-sm text-gray-500">Loading chart data...</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No income data available</p>
                <p className="text-gray-400 text-xs mt-1">Add income transactions to see distribution</p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <CustomPieChart
                data={chartData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                colors={COLORS}
                showTextAnchor
              />
            </div>
          )}
        </div>

        {/* Income Sources Legend & Details */}
        {chartData.length > 0 && (
          <div className="mt-6 space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4">
              {chartData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs text-gray-600 truncate max-w-[100px]">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200/50">
              <h6 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Income Breakdown
              </h6>
              <div className="grid grid-cols-1 gap-2">
                {chartData.slice(0, 4).map((item, index) => {
                  const percentage = ((item.amount / totalIncome) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center justify-between bg-white/80 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">${item.amount.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h6 className="text-sm font-semibold text-green-900 mb-1">Income Insights</h6>
                  <p className="text-xs text-green-700">
                    {sourceCount === 1 
                      ? "Consider diversifying your income sources for better financial stability."
                      : sourceCount >= 3
                      ? "Great job diversifying your income! You have multiple revenue streams."
                      : "You have a good foundation. Consider adding one more income source."
                    }
                  </p>
                </div>
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

export default RecentIncomeWithCharts;