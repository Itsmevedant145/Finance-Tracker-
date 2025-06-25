import React, { useState, useEffect } from "react";
import { API_Path } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosinstance";
import CustomLineChart from "../Charts/CustomLineChart";

const SpendingInsights = () => {
  const [spendingData, setSpendingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpendingData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_Path.SPENDINGINSIGHTS.GET_INSIGHTS);
        if (response.data) {
          setSpendingData(response.data);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpendingData();
  }, []);

  const chartData = spendingData?.monthlyTrends?.map(item => ({
    month: item.month,
    amount: item.total,
  })) || [];

  const getComparisonColor = () => {
    if (!spendingData?.comparisonDirection) return "text-gray-600";
    return spendingData.comparisonDirection === "up"
      ? "text-red-500"
      : "text-green-500";
  };

  const getComparisonIcon = () => {
    if (!spendingData?.comparisonDirection) return "➖";
    return spendingData.comparisonDirection === "up"
      ? "↗️"
      : "↘️";
  };

  const getComparisonMessage = () => {
    switch (spendingData?.comparisonDirection) {
      case "up":
        return "Try to reduce spending in this category";
      case "down":
        return "Great job reducing expenses!";
      case "same":
        return "Spending is consistent with last month.";
      default:
        return "";
    }
  };

  return (
    <div className="card bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h4 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Spending Insights</h4>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : spendingData ? (
        <div className="space-y-5">
          {/* Top Category Section */}
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">📊</span>
              <h5 className="text-md font-medium text-gray-700">Top Spending Category</h5>
            </div>
            <div className="ml-10">
              <p className="text-lg font-semibold text-gray-800">{spendingData.topCategory || "N/A"}</p>
              <p className="text-xl font-bold text-blue-600">₹{spendingData.topAmount?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Month over Month Comparison */}
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{getComparisonIcon()}</span>
              <h5 className="text-md font-medium text-gray-700">Month-over-Month Change</h5>
            </div>
            <div className="ml-10">
              <div className="flex items-center">
                <p className={`text-lg font-semibold ${getComparisonColor()}`}>
                  {spendingData.comparisonDirection === "up"
                    ? "Increased by"
                    : spendingData.comparisonDirection === "down"
                    ? "Decreased by"
                    : "No change"}
                  <span className="text-xl font-bold ml-1">{spendingData.comparisonPercentage || 0}%</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">{getComparisonMessage()}</p>
            </div>
          </div>

          {/* Recurring Expenses */}
          {spendingData.recurringExpenses && spendingData.recurringExpenses.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-500">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔄</span>
                <h5 className="text-md font-medium text-gray-700">Recurring Expenses</h5>
              </div>
              <div className="ml-10 space-y-2">
                {spendingData.recurringExpenses.map((expense, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="text-gray-700">{expense.name}</p>
                    <p className="font-medium">₹{expense.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Trend Chart */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h5 className="text-md font-medium mb-3 text-gray-700 flex items-center">
              <span className="text-xl mr-2">📉</span> Monthly Expense Trend
            </h5>
            <div className="h-64">
              {chartData.length > 0 ? (
                <CustomLineChart data={chartData} />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Not enough data to display trends</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Section */}
          {spendingData.insights && (
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💡</span>
                <h5 className="text-md font-medium text-blue-700">Spending Insight</h5>
              </div>
              <p className="text-gray-700 mt-2 ml-10">{spendingData.insights}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>No spending data available yet</p>
        </div>
      )}
    </div>
  );
};

export default SpendingInsights;
