import React from 'react';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';
import { LuArrowRight } from 'react-icons/lu';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        <button
          onClick={onSeeMore}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"

        >
          See More <LuArrowRight className="text-base" />
        </button>
      </div>

      {/* Transactions list */}
      <div className="space-y-3">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.type === 'expense' ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format('MMM D, YYYY')}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
