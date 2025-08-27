import React, { useState } from "react";
import { TrendingUp, Calendar, Target, AlertTriangle, BarChart3, Activity } from "lucide-react";

// Simple CustomTooltip component for mobile
const CustomTooltip = ({ position, content }) => (
  <div 
    className="fixed z-50 bg-gray-900 text-white text-xs p-3 rounded-lg max-w-xs whitespace-pre-line"
    style={{ 
      left: Math.min(position.x - 100, window.innerWidth - 220), 
      top: position.y - 10,
      transform: 'translateY(-100%)'
    }}
  >
    {content}
  </div>
);

const HeatmapCalculator = ({ last30daysExpense = { transactions: [] }, last60daysIncome = {} }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('spending');

  // Generate sample data for demo if no data provided
  const generateSampleData = () => {
    const today = new Date();
    const transactions = [];
    const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random chance of spending on each day
      if (Math.random() > 0.3) {
        const numTransactions = Math.floor(Math.random() * 4) + 1;
        for (let j = 0; j < numTransactions; j++) {
          transactions.push({
            date: date.toISOString(),
            amount: Math.random() * 200 + 10,
            category: categories[Math.floor(Math.random() * categories.length)]
          });
        }
      }
    }
    return { transactions };
  };

  const expenseData = last30daysExpense?.transactions?.length > 0 ? last30daysExpense : generateSampleData();

  // Enhanced data processing
  const processData = () => {
    const expenseMap = {};
    const categoryMap = {};
    const weekdayData = Array(7).fill(0);
    const weekdayCount = Array(7).fill(0);

    expenseData?.transactions?.forEach(tx => {
      const date = new Date(tx.date);
      const key = date.toISOString().split('T')[0];
      const weekday = date.getDay();
      
      if (!expenseMap[key]) expenseMap[key] = { amount: 0, count: 0, categories: new Set() };
      expenseMap[key].amount += tx.amount;
      expenseMap[key].count += 1;
      expenseMap[key].categories.add(tx.category);
      
      if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
      categoryMap[tx.category] += tx.amount;
      
      weekdayData[weekday] += tx.amount;
      weekdayCount[weekday] += 1;
    });

    return { expenseMap, categoryMap, weekdayData, weekdayCount };
  };

  const { expenseMap, categoryMap, weekdayData, weekdayCount } = processData();

  // Generate 30 days data with enhanced insights
  const generateDaysData = () => {
    const today = new Date();
    const days = [];
    let maxAmount = 0;
    let maxFreq = 0;

    // First pass to find max values
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const dayData = expenseMap[key] || { amount: 0, count: 0, categories: new Set() };
      maxAmount = Math.max(maxAmount, dayData.amount);
      maxFreq = Math.max(maxFreq, dayData.count);
    }

    // Second pass to generate full data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const dayData = expenseMap[key] || { amount: 0, count: 0, categories: new Set() };
      
      // Calculate intensity based on view mode
      let intensity = 0;
      let color = "bg-gray-50 border-gray-200";
      
      if (viewMode === 'spending') {
        intensity = maxAmount > 0 ? (dayData.amount / maxAmount) * 100 : 0;
      } else if (viewMode === 'frequency') {
        intensity = maxFreq > 0 ? (dayData.count / maxFreq) * 100 : 0;
      } else if (viewMode === 'efficiency') {
        const avgPerTx = dayData.count > 0 ? dayData.amount / dayData.count : 0;
        const maxAvg = maxAmount;
        intensity = maxAvg > 0 ? (avgPerTx / maxAvg) * 100 : 0;
      }

      if (intensity > 0) {
        if (intensity >= 80) color = viewMode === 'efficiency' ? "bg-red-500 border-red-600" : "bg-purple-500 border-purple-600";
        else if (intensity >= 60) color = viewMode === 'efficiency' ? "bg-red-400 border-red-500" : "bg-purple-400 border-purple-500";
        else if (intensity >= 40) color = viewMode === 'efficiency' ? "bg-orange-400 border-orange-500" : "bg-purple-300 border-purple-400";
        else if (intensity >= 20) color = viewMode === 'efficiency' ? "bg-yellow-300 border-yellow-400" : "bg-purple-200 border-purple-300";
        else color = viewMode === 'efficiency' ? "bg-green-200 border-green-300" : "bg-purple-100 border-purple-200";
      }

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      days.push({
        key,
        date: date.getDate().toString(),
        fullDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        dayName: dayNames[date.getDay()],
        month: monthNames[date.getMonth()],
        amount: dayData.amount,
        count: dayData.count,
        categories: Array.from(dayData.categories),
        intensity,
        color,
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    return days;
  };

  const days = generateDaysData();

  // Calculate insights
  const calculateInsights = () => {
    const totalDays = days.length;
    const activeDays = days.filter(d => d.amount > 0).length;
    const weekendSpending = days.filter(d => d.isWeekend && d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
    const weekdaySpending = days.filter(d => !d.isWeekend && d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
    
    const avgDailySpend = activeDays > 0 ? days.reduce((sum, d) => sum + d.amount, 0) / activeDays : 0;
    const maxDaySpend = Math.max(...days.map(d => d.amount));
    const maxDay = days.find(d => d.amount === maxDaySpend);
    
    const topCategory = Object.keys(categoryMap).length > 0 ? 
      Object.keys(categoryMap).reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b, '') : 'None';
    const spendingStreak = calculateStreak(days);
    
    return {
      activeDays,
      inactiveDays: totalDays - activeDays,
      avgDailySpend,
      maxDaySpend,
      maxDay,
      topCategory,
      weekendVsWeekday: weekendSpending > weekdaySpending ? 'weekend' : 'weekday',
      spendingStreak,
      consistency: (activeDays / totalDays) * 100,
    };
  };

  const calculateStreak = (days) => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].amount > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return { current: currentStreak, max: maxStreak };
  };

  const insights = calculateInsights();

  const handleMouseEnter = (e, data) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setTooltipData(data);
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Group days by week for better calendar layout
  const groupByWeeks = (days) => {
    const weeks = [];
    let currentWeek = [];
    
    days.forEach((day, index) => {
      const dayDate = new Date(day.key);
      const dayOfWeek = dayDate.getDay();
      
      if (index === 0 || dayOfWeek === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === days.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  const weeks = groupByWeeks(days);

  return (
  <div className="bg-white rounded-lg border border-gray-200 mx-2 sm:mx-0">
    {/* Header */}
    <div className="px-3 sm:px-6 py-4 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="text-base sm:text-lg font-semibold text-gray-900">Spending Calendar</h5>
            <p className="text-xs sm:text-sm text-gray-600">Visual spending pattern analysis</p>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex flex-wrap bg-white rounded-lg border border-gray-200 overflow-hidden">
          {[
            { key: 'spending', label: 'Amount', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'frequency', label: 'Frequency', icon: <Activity className="w-4 h-4" /> },
            { key: 'efficiency', label: 'Per Txn', icon: <Target className="w-4 h-4" /> }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {mode.icon}
              <span className="hidden xs:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-blue-600">{insights.activeDays}</p>
          <p className="text-xs text-gray-600">Active Days</p>
        </div>
        <div>
          <p className="text-lg font-bold text-purple-600">{insights.consistency.toFixed(0)}%</p>
          <p className="text-xs text-gray-600">Consistency</p>
        </div>
        <div>
          <p className="text-lg font-bold text-green-600">{insights.spendingStreak.current}</p>
          <p className="text-xs text-gray-600">Current Streak</p>
        </div>
        <div>
          <p className="text-lg font-bold text-orange-600 capitalize">{insights.weekendVsWeekday}s</p>
          <p className="text-xs text-gray-600">Preference</p>
        </div>
      </div>
    </div>

    {/* Calendar Grid */}
    <div className="p-3 sm:p-6">
      <div className="mb-6">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 sm:mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-1">
              <span className="text-xs sm:text-sm font-medium text-gray-600">{day}</span>
            </div>
          ))}
        </div>

        {/* Week Rows */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const day = week.find(d => new Date(d.key).getDay() === dayIndex);

                if (!day) {
                  return <div key={dayIndex} className="h-10 sm:h-16"></div>;
                }

                return (
                  <div key={day.key} className="relative">
                    <div
                      className={`h-10 sm:h-16 w-full rounded-lg ${day.color} border cursor-default flex flex-col items-center justify-center ${
                        day.isToday ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <span className={`text-xs sm:text-base font-medium ${
                        day.intensity > 40 ? 'text-white' : 'text-gray-700'
                      }`}>
                        {day.date}
                      </span>
                      {day.amount > 0 && (
                        <span className={`text-[10px] sm:text-xs font-medium ${
                          day.intensity > 40 ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          ${day.amount.toFixed(0)}
                        </span>
                      )}
                      {day.count > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {Array.from({ length: Math.min(day.count, 3) }, (_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                day.intensity > 40 ? 'bg-white/70' : 'bg-blue-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">No activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${viewMode === 'efficiency' ? 'bg-green-200 border-green-300' : 'bg-purple-100 border-purple-200'}`}></div>
            <span className="text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${viewMode === 'efficiency' ? 'bg-yellow-300 border-yellow-400' : 'bg-purple-300 border-purple-400'}`}></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${viewMode === 'efficiency' ? 'bg-red-500 border-red-600' : 'bg-purple-500 border-purple-600'}`}></div>
            <span className="text-gray-600">High</span>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mt-1" />
          <div>
            <h6 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Calendar Insight</h6>
            <p className="text-blue-700 text-xs sm:text-sm">
              {insights.spendingStreak.current > 7 
                ? `You've been spending consistently for ${insights.spendingStreak.current} days. Consider taking a spending break to maintain balance.`
                : insights.consistency < 30 
                ? "Your spending pattern shows excellent restraint. You're maintaining great financial discipline with selective spending days."
                : `You tend to spend more on ${insights.weekendVsWeekday}s. Consider creating specific budgets for ${insights.weekendVsWeekday} activities.`}
            </p>
            {insights.maxDay && insights.maxDaySpend > 0 && (
              <p className="text-blue-600 text-[11px] mt-2">
                Your highest spending day was {insights.maxDay.fullDate} with ${insights.maxDaySpend.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default HeatmapCalculator;