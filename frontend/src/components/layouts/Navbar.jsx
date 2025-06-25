import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { BiPieChartAlt2 } from 'react-icons/bi'; // Import budget icon
import './Navbar.css';
import BudgetPopover from './BudgetPopover'; // We'll create this next

const Navbar = ({ toggleSidebar, sidebarOpen, budgetData }) => {
  const [budgetPopoverVisible, setBudgetPopoverVisible] = useState(false);
  
  // Calculate number of over-budget categories
  const overBudgetCount = budgetData?.categories?.filter(
    category => category.spentAmount > category.budgetAmount
  ).length || 0;
  
  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Toggle button that switches between hamburger and X */}
        <button className="navbar-menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
        <h2 className="navbar-title">Expense Tracker</h2>
      </div>

      <div className="navbar-right">
        {/* Budget icon with notification indicator */}
        <div className="budget-icon-container">
          <button 
            className="budget-icon-btn" 
            onClick={() => setBudgetPopoverVisible(!budgetPopoverVisible)}
            aria-label="View budget"
          >
            <BiPieChartAlt2 className="budget-icon" />
            {overBudgetCount > 0 && (
              <span className="budget-alert-badge">{overBudgetCount}</span>
            )}
          </button>
          
          {/* Budget popover */}
          {budgetPopoverVisible && (
            <BudgetPopover 
              budgetData={budgetData} 
              onClose={() => setBudgetPopoverVisible(false)}
              onViewFull={() => window.location.href = '/budget'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;