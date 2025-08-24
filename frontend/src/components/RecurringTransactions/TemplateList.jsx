import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const TemplateList = ({ templates, activeTemplate, setActiveTemplate, setSelectedDays }) => {
  const selectWeekdays = () => {
    const newSet = new Set();
    for (let i = 1; i <= 31; i++) {
      const day = new Date(2024, 2, i); // March 2024
      const weekday = day.getDay(); // 0 = Sunday, 1 = Monday...
      if (weekday >= 1 && weekday <= 5) newSet.add(i);
    }
    setSelectedDays(newSet);
  };

  const selectWeekends = () => {
    const newSet = new Set();
    for (let i = 1; i <= 31; i++) {
      const day = new Date(2024, 2, i);
      const weekday = day.getDay();
      if (weekday === 0 || weekday === 6) newSet.add(i);
    }
    setSelectedDays(newSet);
  };

  const clearAll = () => setSelectedDays(new Set());

  const switchTemplate = (id) => {
    setActiveTemplate(id);
    if (id === 0) selectWeekdays();
    else if (id === 1) selectWeekends();
    else clearAll();
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
        <Calendar className="w-6 h-6" />
        Your Templates
      </h2>

      <div className="space-y-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isActive = activeTemplate === template.id;

          return (
            <div
              key={template.id}
              onClick={() => switchTemplate(template.id)}
              className={`bg-white rounded-xl p-5 border-l-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isActive ? 'border-l-indigo-500 bg-indigo-50 shadow-md' : 'border-l-emerald-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {template.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {template.category} • {template.frequency}
                  </div>
                </div>
                <div className={`font-bold text-lg ${template.type === 'expense' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {template.type === 'expense' ? '-' : '+'}${template.amount.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}

        <button className="w-full bg-purple-100 text-purple-700 rounded-xl p-4 font-medium hover:bg-purple-200 transition-colors duration-200 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Template
        </button>
      </div>
    </div>
  );
};

export default TemplateList;
