import React, { useRef, useEffect } from 'react';

const BudgetPopover = ({ budgetData, onClose, onViewFull }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const totalBudget = budgetData?.totalBudget || 0;
  const totalSpent = budgetData?.totalSpent || 0;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div
      ref={popoverRef}
      className="absolute top-[50px] right-[10px] w-[300px] bg-white rounded-lg shadow-lg border-2 border-blue-400 z-[1000] overflow-hidden"
    >
      {/* Arrow */}
      <div className="absolute top-[-10px] right-5 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-blue-400" />

      {/* Header */}
      <div className="bg-blue-100 p-[12px_15px] flex justify-between items-center border-b border-gray-200">
        <h3 className="text-[#2b6cb0] text-[16px] font-semibold m-0">May 2025 Budget</h3>
        <button
          className="text-[20px] text-gray-500 bg-none border-none cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {/* Overall Progress */}
      <div className="p-[16px] border-b border-gray-200">
        <div className="text-[14px] text-gray-700 font-medium mb-[6px] text-center">
          Budget Usage
        </div>
        <div className="h-[18px] bg-gray-200 rounded-full overflow-hidden mb-[8px]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
        <div className="text-[12px] text-gray-600 text-center">
          ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
        </div>
      </div>

      {/* Footer */}
      <div className="p-[12px_15px] flex justify-center">
        <button
          onClick={onViewFull}
          className="text-[12px] font-bold text-blue-500 hover:underline cursor-pointer"
        >
          View Full Budget Details →
        </button>
      </div>
    </div>
  );
};

export default BudgetPopover;
