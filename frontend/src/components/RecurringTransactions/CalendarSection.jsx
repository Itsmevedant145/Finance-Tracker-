import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarSection = ({ activeTemplate, templates, selectedDays, setSelectedDays }) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = 15;

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 25; i <= 29; i++) days.push({ day: i, isCurrentMonth: false });
    for (let i = 1; i <= 31; i++) days.push({ day: i, isCurrentMonth: true });
    return days;
  };

  const isWeekend = (index) => index % 7 === 5 || index % 7 === 6;

  const toggleDay = (day) => {
    const newSet = new Set(selectedDays);
    newSet.has(day) ? newSet.delete(day) : newSet.add(day);
    setSelectedDays(newSet);
  };

  const selectLastWeek = () => {
    const newSet = new Set();
    for (let i = Math.max(1, today - 6); i <= today; i++) newSet.add(i);
    setSelectedDays(newSet);
  };

  const clearAll = () => setSelectedDays(new Set());

  const selectWeekdays = () => {
    const newSet = new Set();
    calendarDays.forEach((dayObj, idx) => {
      if (dayObj.isCurrentMonth && !isWeekend(idx)) {
        newSet.add(dayObj.day);
      }
    });
    setSelectedDays(newSet);
  };

  const selectWeekends = () => {
    const newSet = new Set();
    calendarDays.forEach((dayObj, idx) => {
      if (dayObj.isCurrentMonth && isWeekend(idx)) {
        newSet.add(dayObj.day);
      }
    });
    setSelectedDays(newSet);
  };

  const calendarDays = generateCalendarDays();
  const selectedCount = selectedDays.size;
  const template = templates[activeTemplate];
  const totalAmount = selectedCount * template.amount;

  const createTransactions = () => {
    alert(`✅ Successfully created ${selectedCount} ${template.name} transactions!\n\nTotal: $${totalAmount.toFixed(2)}`);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          📅 March 2024 - {template.name}
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><ChevronLeft /></button>
        <div className="text-xl font-semibold text-slate-800">March 2024</div>
        <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><ChevronRight /></button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={selectWeekdays}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
        >
          Select All Weekdays
        </button>
        <button
          onClick={selectWeekends}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
        >
          Select All Weekends
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={selectLastWeek}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
        >
          Select Last 7 Days
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekdays.map((day) => (
          <div key={day} className="text-center py-3 font-semibold text-slate-600 text-sm">
            {day}
          </div>
        ))}

        {calendarDays.map((dayObj, index) => {
          const isSelected = selectedDays.has(dayObj.day) && dayObj.isCurrentMonth;
          const isToday = dayObj.day === today && dayObj.isCurrentMonth;
          const isWeekendDay = isWeekend(index);

          return (
            <div
              key={`${dayObj.day}-${index}`}
              onClick={() => dayObj.isCurrentMonth && toggleDay(dayObj.day)}
              className={`
                aspect-square flex items-center justify-center rounded-lg font-medium transition-all duration-200
                ${dayObj.isCurrentMonth ? 'cursor-pointer hover:bg-slate-100' : 'text-slate-300 cursor-default'}
                ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                ${isToday ? 'ring-2 ring-emerald-500' : ''}
                ${isWeekendDay && dayObj.isCurrentMonth && !isSelected ? 'text-slate-400' : ''}
              `}
            >
              {dayObj.day}
            </div>
          );
        })}
      </div>

      {/* Summary & Create Button */}
      <div className="bg-slate-50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-800">{selectedCount}</div>
            <div className="text-sm text-slate-600">Days Selected</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${template.type === 'expense' ? 'text-red-600' : 'text-emerald-600'}`}>
              ${totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">Total Amount</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              ${template.amount.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">Per Day</div>
          </div>
        </div>

        <button
          onClick={createTransactions}
          disabled={selectedCount === 0}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Create {selectedCount} Transactions
        </button>
      </div>
    </div>
  );
};

export default CalendarSection;
