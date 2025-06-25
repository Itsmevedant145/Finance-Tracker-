import React from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import './Navbar.css';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
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
        {/* Removed budget icon and popover */}
      </div>
    </div>
  );
};

export default Navbar;
