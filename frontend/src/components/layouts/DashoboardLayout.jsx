import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";
import RecentTransactions from "../Dashboard/RecentTransactions"; // ✅ Import it if not already
import { useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children, activeMenu, dashboardData }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) return null;

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Main content */}
      <div className="main-content-wrapper">
        <Navbar
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {/* Page content */}
        <div className="dashboard-content">
          {children}
        </div>

        {/* Recent Transactions */}
       
      </div>
    </div>
  );
};

export default DashboardLayout;
