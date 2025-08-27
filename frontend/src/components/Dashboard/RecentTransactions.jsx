import React from 'react';
import { ArrowRight, Clock, TrendingUp, TrendingDown, Activity, Filter } from 'lucide-react';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  // Calculate transaction stats
  const incomeTransactions = transactions?.filter(t => t.type === 'income') || [];
  const expenseTransactions = transactions?.filter(t => t.type === 'expense') || [];
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-gray-700 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-sm text-gray-600">Latest financial activity</p>
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

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Total</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{transactions?.length || 0}</p>
          </div>

          {/* Income Count */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Income</span>
            </div>
            <p className="text-lg font-bold text-green-900">{incomeTransactions.length}</p>
          </div>

          {/* Expense Count */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Expenses</span>
            </div>
            <p className="text-lg font-bold text-red-900">{expenseTransactions.length}</p>
          </div>
        </div>

        {/* Transactions List */}
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500 text-sm mb-6">Start by adding your first income or expense</p>
            <div className="flex justify-center gap-3">
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                Add Income
              </div>
              <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
                Add Expense
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {transactions?.slice(0, 5)?.map((item, index) => (
                <div 
                  key={item.id} 
                  className="transform hover:scale-[1.02] transition-all duration-200"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`rounded-xl p-1 transition-all duration-200 ${
                    item.type === 'income' 
                      ? 'hover:bg-green-50/50 bg-green-50/30' 
                      : 'hover:bg-red-50/50 bg-red-50/30'
                  }`}>
                    <TransactionInfoCard
                      key={item.id}
                      title={item.type === 'expense' ? item.category : item.source}
                      icon={item.icon}
                      date={moment(item.date).format('MMM D, YYYY')}
                      amount={item.amount}
                      type={item.type}
                      hideDeleteBtn
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* More Transactions Indicator */}
            {transactions.length > 5 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-300 rounded-full" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    +{transactions.length - 5} more transactions
                  </span>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Recent Income Total */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">Recent Income</p>
                    <p className="text-lg font-bold text-green-900">${totalIncome.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Recent Expenses Total */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">Recent Expenses</p>
                    <p className="text-lg font-bold text-red-900">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>

            {/* Net Flow Indicator */}
            <div className="mt-4">
              <div className={`p-4 rounded-xl border ${
                totalIncome >= totalExpenses 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Flow</span>
                  <div className="flex items-center gap-2">
                    {totalIncome >= totalExpenses ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-bold">
                      ${Math.abs(totalIncome - totalExpenses).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
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

export default RecentTransactions;