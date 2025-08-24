import React, { useState } from 'react';
import { Coffee, Car, ShoppingCart, DollarSign } from 'lucide-react';
import TemplateList from './TemplateList';
import CalendarSection from './CalendarSection';

const RecurringTransactions = () => {
  const [selectedDays, setSelectedDays] = useState(new Set([1,4,5,6,7,8,11,12,13,14,15,18,19,20,21,22,25,26,27,28,29]));
  const [activeTemplate, setActiveTemplate] = useState(0);

  const templates = [
    { id: 0, name: '☕ Daily Coffee', category: 'Food & Beverage', frequency: 'Weekdays', amount: 5.00, type: 'expense', icon: Coffee },
    { id: 1, name: '⛽ Weekly Gas', category: 'Transportation', frequency: 'Sundays', amount: 60.00, type: 'expense', icon: Car },
    { id: 2, name: '🛒 Groceries', category: 'Food', frequency: 'Saturdays', amount: 150.00, type: 'expense', icon: ShoppingCart },
    { id: 3, name: '💰 Freelance Payment', category: 'Income', frequency: 'Bi-weekly', amount: 800.00, type: 'income', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-3">🔄 Recurring Transactions</h1>
          <p className="text-lg opacity-90">Set up your regular expenses and income with smart calendar selection</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          <TemplateList
            templates={templates}
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            setSelectedDays={setSelectedDays}
          />
          <CalendarSection
            activeTemplate={activeTemplate}
            templates={templates}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        </div>
      </div>
    </div>
  );
};

export default RecurringTransactions;
