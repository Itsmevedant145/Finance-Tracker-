import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import Inputs from "../layouts/inputs/Inputs";
import React, { useState } from "react";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
        <EmojiPickerPopup
        icon = {income.icon}
        onSelect = {(selectedIcon) => handleChange("icon",selectedIcon)}
       /> 
      <Inputs
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      <Inputs
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Inputs
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div>
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
