import React from "react";
import {
  LuBriefcase,
  LuGift,
  LuBanknote,
  LuCoins,
  LuBuilding2,
  LuArrowRight
} from "react-icons/lu"; // ✅ Removed invalid LuBanknoteIcon

import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";
//import "./RecentIncome.css";

// Generate a fallback icon based on income source
const getCategoryIcon = (source) => {
  const lower = (source || '').toLowerCase();

  switch (lower) {
    case 'salary':
    case 'job':
    case 'work':
      return <LuBriefcase className="category-icon" />;
    case 'gift':
    case 'gifts':
      return <LuGift className="category-icon" />;
    case 'investment':
    case 'investments':
      return <LuCoins className="category-icon" />;
    case 'rent':
    case 'property':
      return <LuBuilding2 className="category-icon" />;
    default:
      return <LuBanknote className="category-icon" />;
  }
};

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
  <div className="card">
    <div className="flex items-center justify-between">
      <h5 className="text-lg">Income</h5>
      <button className="card-btn" onClick={onSeeMore}>
        See All <LuArrowRight className="text-base" />
      </button>
    </div>

    <div className="mt-6">
      {transactions?.slice(0,5).map((item) => (
        <TransactionInfoCard
        key = {item._id}
        title = {item?.source }
        icon={item.icon}
        date={moment(item.data).format("DD MMM YYYY")}
        amount={item?.amount}
        type="income"
        hideDeleteBtn
/>
      ))}

    </div>
  </div>
  
  )
};

export default RecentIncome;
