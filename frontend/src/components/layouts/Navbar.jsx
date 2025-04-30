import React from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // Removed bell import
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
        {/* No bell icon, just empty div now */}
      </div>
    </div>
  );
};

export default Navbar;
