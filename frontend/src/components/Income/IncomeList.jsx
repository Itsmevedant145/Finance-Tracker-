import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";

// Removed unused import: `data` from "react-router-dom"

const IncomeList = ({ transactions, onDelete, onDowload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Source</h5>
        <button className="card-btn" onClick={onDowload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2"> {/* Fixed typos: grif -> grid, grif-clos-1 -> grid-cols-1 */}
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            data={moment(income.date).format("Do MM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income._id)} // ✅ Fixed: was `onDelete{}` — invalid syntax
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
