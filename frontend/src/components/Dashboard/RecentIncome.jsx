import React from "react";
import {
  Briefcase,
  Gift,
  Banknote,
  Coins,
  Building2,
  ArrowRight,
  TrendingUp,
  DollarSign
} from "lucide-react";

import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

// Generate a fallback icon based on income source
const getCategoryIcon = (source) => {
  const lower = (source || '').toLowerCase();

  switch (lower) {
    case 'salary':
    case 'job':
    case 'work':
      return <Briefcase className="w-4 h-4" />;
    case 'gift':
    case 'gifts':
      return <Gift className="w-4 h-4" />;
    case 'investment':
    case 'investments':
      return <Coins className="w-4 h-4" />;
    case 'rent':
    case 'property':
      return <Building2 className="w-4 h-4" />;
    default:
      return <Banknote className="w-4 h-4" />;
  }
};

const RecentIncome = ({ transactions, onSeeMore }) => {
  const totalIncome = transactions?.reduce((sum, income) => sum + income.amount, 0) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-gray-900">Recent Income</h5>
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold text-green-600">${totalIncome.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onSeeMore}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            View All 
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-6">
        {transactions?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No income recorded yet</p>
            <p className="text-gray-400 text-xs mt-1">Add your first income transaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions?.slice(0, 5).map((item, index) => (
              <div 
                key={item._id} 
                className="transform hover:scale-[1.02] transition-all duration-200"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-1 hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                  <TransactionInfoCard
                    title={item?.source}
                    icon={item.icon || getCategoryIcon(item?.source)}
                    date={moment(item.date).format("DD MMM YYYY")}
                    amount={item?.amount}
                    type="income"
                    hideDeleteBtn
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {transactions?.length > 5 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              +{transactions.length - 5} more income sources
            </p>
          </div>
        )}

        {/* Income Categories Summary */}
        {transactions?.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
            <div className="flex items-center justify-between mb-3">
              <h6 className="text-sm font-semibold text-green-900">Income Sources</h6>
              <Coins className="w-4 h-4 text-green-600" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Get unique sources and their totals */}
              {Object.entries(
                transactions.reduce((acc, item) => {
                  const source = item.source || 'Other';
                  acc[source] = (acc[source] || 0) + item.amount;
                  return acc;
                }, {})
              ).slice(0, 4).map(([source, amount]) => (
                <div key={source} className="flex items-center justify-between bg-white/80 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(source)}
                    <span className="text-xs font-medium text-gray-700 truncate">{source}</span>
                  </div>
                  <span className="text-xs font-bold text-green-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RecentIncome;