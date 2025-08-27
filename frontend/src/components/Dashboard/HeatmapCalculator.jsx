import React, { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle, Award, BarChart3, Activity } from "lucide-react";
import CustomTooltip from "../Charts/CustomTooltip";
import dayjs from "dayjs";

const HeatmapCalculator = ({ last30daysExpense, last60daysIncome }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('spending'); // 'spending', 'frequency', 'efficiency'

  // Enhanced data processing
  const processData = () => {
    const expenseMap = {};
    const categoryMap = {};
    const weekdayData = Array(7).fill(0);
    const weekdayCount = Array(7).fill(0);

    last30daysExpense?.transactions?.forEach(tx => {
      const date = dayjs(tx.date);
      const key = date.format("YYYY-MM-DD");
      const weekday = date.day();
      
      if (!expenseMap[key]) expenseMap[key] = { amount: 0, count: 0, categories: new Set() };
      expenseMap[key].amount += tx.amount;
      expenseMap[key].count += 1;
      expenseMap[key].categories.add(tx.category);
      
      // Category tracking
      if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
      categoryMap[tx.category] += tx.amount;
      
      // Weekday analysis
      weekdayData[weekday] += tx.amount;
      weekdayCount[weekday] += 1;
    });

    return { expenseMap, categoryMap, weekdayData, weekdayCount };
  };

  const { expenseMap, categoryMap, weekdayData, weekdayCount } = processData();

  // Generate 30 days data with enhanced insights
  const generateDaysData = () => {
    const today = dayjs();
    const days = [];
    let maxAmount = 0;
    let maxFreq = 0;

    // First pass to find max values
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, "day");
      const key = date.format("YYYY-MM-DD");
      const dayData = expenseMap[key] || { amount: 0, count: 0, categories: new Set() };
      maxAmount = Math.max(maxAmount, dayData.amount);
      maxFreq = Math.max(maxFreq, dayData.count);
    }

    // Second pass to generate full data
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, "day");
      const key = date.format("YYYY-MM-DD");
      const dayData = expenseMap[key] || { amount: 0, count: 0, categories: new Set() };
      
      // Calculate intensity based on view mode
      let intensity = 0;
      let color = "bg-gray-50 border-gray-200";
      
      if (viewMode === 'spending') {
        intensity = maxAmount > 0 ? (dayData.amount / maxAmount) * 100 : 0;
      } else if (viewMode === 'frequency') {
        intensity = maxFreq > 0 ? (dayData.count / maxFreq) * 100 : 0;
      } else if (viewMode === 'efficiency') {
        // Efficiency = spending per transaction (lower is better for budgeting)
        const avgPerTx = dayData.count > 0 ? dayData.amount / dayData.count : 0;
        const maxAvg = maxAmount; // Approximation
        intensity = maxAvg > 0 ? (avgPerTx / maxAvg) * 100 : 0;
      }

      if (intensity > 0) {
        if (intensity >= 80) color = viewMode === 'efficiency' ? "bg-red-500 border-red-600 shadow-red-200" : "bg-purple-500 border-purple-600 shadow-purple-200";
        else if (intensity >= 60) color = viewMode === 'efficiency' ? "bg-red-400 border-red-500 shadow-red-100" : "bg-purple-400 border-purple-500 shadow-purple-100";
        else if (intensity >= 40) color = viewMode === 'efficiency' ? "bg-orange-400 border-orange-500 shadow-orange-100" : "bg-purple-300 border-purple-400 shadow-purple-100";
        else if (intensity >= 20) color = viewMode === 'efficiency' ? "bg-yellow-300 border-yellow-400 shadow-yellow-100" : "bg-purple-200 border-purple-300";
        else color = viewMode === 'efficiency' ? "bg-green-200 border-green-300" : "bg-purple-100 border-purple-200";
      }

      days.push({
        key,
        date: date.format("D"),
        fullDate: date.format("MMM DD"),
        dayName: date.format("ddd"),
        month: date.format("MMM"),
        amount: dayData.amount,
        count: dayData.count,
        categories: Array.from(dayData.categories),
        intensity,
        color,
        isToday: date.isSame(today, "day"),
        isWeekend: date.day() === 0 || date.day() === 6,
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
    
    const topCategory = Object.keys(categoryMap).reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b, '');
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
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setTooltipData(data);
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'high': return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'good': return <Award className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Target className="w-5 h-5 text-blue-500" />;
    }
  };

  // Group days by week for better calendar layout
  const groupByWeeks = (days) => {
    const weeks = [];
    let currentWeek = [];
    
    days.forEach((day, index) => {
      const dayOfWeek = dayjs(day.key).day(); // 0 = Sunday, 1 = Monday, etc.
      
      // If it's the first day or we hit Sunday, start a new week
      if (index === 0 || dayOfWeek === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      // If it's the last day, push the current week
      if (index === days.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  const weeks = groupByWeeks(days);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="text-xl font-bold text-gray-900">Spending Calendar</h5>
              <p className="text-sm text-gray-600">Visual spending pattern analysis</p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {[
              { key: 'spending', label: 'Amount', icon: <BarChart3 className="w-4 h-4" /> },
              { key: 'frequency', label: 'Frequency', icon: <Activity className="w-4 h-4" /> },
              { key: 'efficiency', label: 'Per Transaction', icon: <Target className="w-4 h-4" /> }
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all ${
                  viewMode === mode.key
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{insights.activeDays}</p>
            <p className="text-xs text-gray-600">Active Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{insights.consistency.toFixed(0)}%</p>
            <p className="text-xs text-gray-600">Consistency</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{insights.spendingStreak.current}</p>
            <p className="text-xs text-gray-600">Current Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 capitalize">{insights.weekendVsWeekday}s</p>
            <p className="text-xs text-gray-600">Preference</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Large Calendar Grid */}
        <div className="mb-8">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-sm font-semibold text-gray-600">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Weeks */}
          <div className="space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week.find(d => dayjs(d.key).day() === dayIndex);
                  
                  if (!day) {
                    return <div key={dayIndex} className="h-16"></div>;
                  }

                  return (
                    <div key={day.key} className="relative group">
                      <div
                        className={`h-16 w-full rounded-xl ${day.color} border-2 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center relative overflow-hidden ${
                          day.isToday ? "ring-2 ring-purple-500 ring-offset-2" : ""
                        }`}
                        onMouseEnter={(e) => handleMouseEnter(e, day)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Date Number */}
                        <span className={`text-lg font-bold ${
                          day.intensity > 40 ? 'text-white' : 'text-gray-700'
                        }`}>
                          {day.date}
                        </span>
                        
                        {/* Amount Indicator */}
                        {day.amount > 0 && (
                          <span className={`text-xs font-medium ${
                            day.intensity > 40 ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            ${day.amount.toFixed(0)}
                          </span>
                        )}

                        {/* Activity Dots */}
                        {day.count > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {Array.from({ length: Math.min(day.count, 3) }, (_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  day.intensity > 40 ? 'bg-white/70' : 'bg-purple-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Today Indicator */}
                        {day.isToday && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Enhanced Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h6 className="font-bold text-amber-800 mb-2">Calendar Insight</h6>
              <p className="text-amber-700 leading-relaxed">
                {insights.spendingStreak.current > 7 
                  ? `🔥 You've been spending consistently for ${insights.spendingStreak.current} days. Consider taking a spending break to maintain balance.`
                  : insights.consistency < 30 
                  ? "✨ Your spending pattern shows excellent restraint. You're maintaining great financial discipline with selective spending days."
                  : `📊 You tend to spend more on ${insights.weekendVsWeekday}s. Consider creating specific budgets for ${insights.weekendVsWeekday} activities.`
                }
              </p>
              {insights.maxDay && (
                <p className="text-amber-600 text-sm mt-2">
                  💡 Your highest spending day was {insights.maxDay.fullDate} with ${insights.maxDaySpend.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tooltip */}
      {tooltipData && (
        <CustomTooltip
          position={tooltipPosition}
          content={`📅 ${tooltipData.fullDate} (${tooltipData.dayName})
💰 Amount: $${tooltipData.amount.toFixed(2)}
🔢 Transactions: ${tooltipData.count}
📊 Categories: ${tooltipData.categories.join(', ') || 'None'}
${tooltipData.isWeekend ? '🎉 Weekend' : '💼 Weekday'}
${tooltipData.isToday ? '⭐ Today' : ''}`}
        />
      )}
    </div>
  );
};

export default HeatmapCalculator;