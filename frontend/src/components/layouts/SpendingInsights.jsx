import React, { useState, useEffect } from "react";
import { API_Path } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosinstance";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Eye, EyeOff, 
         BarChart3, PieChart, AlertCircle, CheckCircle, Target, 
         Calendar, DollarSign, Repeat, Lightbulb, ArrowUpRight, ArrowDownRight } from "lucide-react";
import CustomLineChart from "../Charts/CustomLineChart";

const SpendingInsights = () => {
  const [spendingData, setSpendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

    if (isExpanded) {
      fetchSpendingData();
    }
  }, [isExpanded]);

  const chartData = spendingData?.monthlyTrends?.map(item => ({
    month: item.month,
    amount: item.total,
  })) || [];

  const getComparisonData = () => {
    if (!spendingData?.comparisonDirection) return {
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
      icon: <Target className="w-5 h-5" />,
      trend: "stable"
    };

    const isUp = spendingData.comparisonDirection === "up";
    return {
      color: isUp ? "text-red-600" : "text-green-600",
      bgColor: isUp ? "bg-red-50" : "bg-green-50",
      borderColor: isUp ? "border-red-200" : "border-green-200",
      icon: isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />,
      trend: isUp ? "increase" : "decrease"
    };
  };

  const comparisonData = getComparisonData();

  const getInsightIcon = () => {
    if (!spendingData?.comparisonDirection) return <Lightbulb className="w-5 h-5 text-blue-500" />;
    return spendingData.comparisonDirection === "up" 
      ? <AlertCircle className="w-5 h-5 text-amber-500" />
      : <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getSmartRecommendation = () => {
    if (!spendingData) return "Start tracking your expenses to get personalized insights.";
    
    const { comparisonDirection, comparisonPercentage, topCategory } = spendingData;
    
    if (comparisonDirection === "up" && comparisonPercentage > 15) {
      return `Your spending increased by ${comparisonPercentage}%. Consider setting a budget limit for ${topCategory} to maintain control.`;
    } else if (comparisonDirection === "down") {
      return `Excellent! You've reduced spending by ${comparisonPercentage}%. Keep up the disciplined approach to reach your financial goals.`;
    } else {
      return `Your spending is consistent. Consider optimizing your largest expense category: ${topCategory}.`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis', icon: <PieChart className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100 cursor-pointer hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              {isExpanded ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Advanced Spending Analytics</h4>
              <p className="text-sm text-gray-600">
                {isExpanded ? "Deep insights into your financial behavior" : "Click to reveal detailed analysis"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isExpanded && spendingData?.comparisonPercentage && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${comparisonData.bgColor} ${comparisonData.color}`}>
                {comparisonData.icon}
                <span className="text-sm font-medium">{spendingData.comparisonPercentage}%</span>
              </div>
            )}
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0"></div>
              </div>
              <p className="text-gray-600 font-medium">Analyzing your spending patterns...</p>
            </div>
          ) : spendingData ? (
            <>
              {/* Navigation Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex-1 justify-center ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Category */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-blue-800">Top Spending Category</h6>
                          <p className="text-sm text-blue-600">Your biggest expense</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-blue-900">{spendingData.topCategory || "N/A"}</p>
                        <p className="text-2xl font-black text-blue-600">${spendingData.topAmount?.toLocaleString() || 0}</p>
                      </div>
                    </div>

                    {/* Comparison Metric */}
                    <div className={`bg-gradient-to-br ${comparisonData.bgColor} to-opacity-50 rounded-xl p-5 border ${comparisonData.borderColor}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${comparisonData.color.replace('text-', 'bg-').replace('-600', '-500')}`}>
                          {comparisonData.icon}
                        </div>
                        <div>
                          <h6 className={`font-semibold ${comparisonData.color.replace('-600', '-800')}`}>Monthly Change</h6>
                          <p className={`text-sm ${comparisonData.color.replace('-600', '-600')}`}>vs. last month</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className={`text-lg font-bold ${comparisonData.color.replace('-600', '-900')}`}>
                          {spendingData.comparisonDirection === "up" ? "Increased" : 
                           spendingData.comparisonDirection === "down" ? "Decreased" : "Stable"}
                        </p>
                        <p className={`text-2xl font-black ${comparisonData.color}`}>
                          {spendingData.comparisonPercentage || 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Smart Insight */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-start gap-3">
                      {getInsightIcon()}
                      <div className="flex-1">
                        <h6 className="font-semibold text-amber-800 mb-2">AI-Powered Insight</h6>
                        <p className="text-amber-700 leading-relaxed">{getSmartRecommendation()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6">
                  {/* Chart Section */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <h6 className="font-semibold text-gray-800">Monthly Spending Trend</h6>
                    </div>
                    <div className="h-64">
                      {chartData.length > 0 ? (
                        <CustomLineChart data={chartData} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 font-medium">Insufficient data for trend analysis</p>
                          <p className="text-sm text-gray-400">Add more transactions to see trends</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trend Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-800">Trend Analysis</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        {chartData.length > 2 ? "Your spending pattern shows seasonal variations" : "More data needed for trend analysis"}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800">Forecast</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Based on current trends, maintain your spending discipline
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  {/* Recurring Expenses */}
                  {spendingData.recurringExpenses?.length > 0 && (
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-500 rounded-lg">
                          <Repeat className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-violet-800">Recurring Expenses</h6>
                          <p className="text-sm text-violet-600">Fixed monthly commitments</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {spendingData.recurringExpenses.map((expense, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                            <span className="font-medium text-violet-900">{expense.name}</span>
                            <span className="font-bold text-violet-700">${expense.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Insights */}
                  {spendingData.insights && (
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-teal-600 mt-1" />
                        <div>
                          <h6 className="font-semibold text-teal-800 mb-2">Deep Analysis</h6>
                          <p className="text-teal-700 leading-relaxed">{spendingData.insights}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 border border-rose-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-rose-600" />
                      <h6 className="font-semibold text-rose-800">Recommended Actions</h6>
                    </div>
                    <ul className="space-y-2 text-sm text-rose-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                        Set monthly budget limits for your top spending category
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                        Review and optimize recurring expenses quarterly
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                        Track daily spending to maintain awareness
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-600 mb-1">No spending data available</p>
                <p className="text-sm text-gray-500">Start adding transactions to see insights</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpendingInsights;