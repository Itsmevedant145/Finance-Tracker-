import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashoboardLayout'; // ✅ Fixed typo: "DashoboardLayout"
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import { IoMdCard } from 'react-icons/io';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { InfoCard } from '../../components/cards/InfoCard';
import { addThousandSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverveiw from '../../components/Dashboard/FinanceOverveiw';
import ExpenseTranscations from '../../components/Dashboard/ExpenseTranscations'; // ✅ Import it if not already
import Last30daysExpense from '../../components/Dashboard/last30daysExpense'; // ✅ Import it if not already
import RecentIncomeWithCharts from '../../components/Dashboard/RecentIncomeWithCharts'; // ✅ Import it if not already
import RecentIncome from '../../components/Dashboard/RecentIncome'; // ✅ Import it if not already

const Home = () => {
  useUserAuth(); // Ensure user is authenticated
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_Path.DASHBOARD.GET_USER_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Spinner Styles (Inline)
  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#ffffff',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 9999,
  };

  const spinnerStyle = {
    border: '8px solid #f3f3f3', // Light grey background
    borderTop: '8px solid #4caf50', // Green color for the spinner
    borderRadius: '50%', // Make it round
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite', // Spin animation
    boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)', // Glowing effect
  };
  

  // Spinner animation keyframe (could be added globally if you're using inline styles)
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.styleSheets[0]?.insertRule(keyframes, document.styleSheets[0].cssRules.length);

  if (loading || !dashboardData) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
      </div>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard" dashboardData={dashboardData}>
  {/* First row — 3 cards side-by-side */}
  <div className="infocontainer">
    <InfoCard
      icon={<IoMdCard className="icon" />}
      label="Total Balance"
      value={addThousandSeparator(dashboardData.totalBalance || 0)}
      themeClass="theme-blue"
    />
    <InfoCard
      icon={<LuHandCoins className="icon" />}
      label="Total Income"
      value={addThousandSeparator(dashboardData.totalIncome || 0)}
      themeClass="theme-green"
    />
    <InfoCard
      icon={<LuWalletMinimal className="icon" />}
      label="Total Expense"
      value={addThousandSeparator(dashboardData.totalExpense || 0)}
      themeClass="theme-red"
    />
  </div>

  {/* All other components in 2-column grid layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <FinanceOverveiw
      totalBalance={dashboardData.totalBalance || 0}
      totalIncome={dashboardData.totalIncome || 0}
      totalExpense={dashboardData.totalExpense || 0}
    />
    <RecentTransactions
      transactions={dashboardData.lastTransactions || []}
      onSeeMore={() => navigate("/expense")}
    />
    <ExpenseTranscations
      transactions={dashboardData?.last30daysExpense?.transactions || []}
      onSeeMore={() => navigate("/expense")}
    />
    <Last30daysExpense
      data={dashboardData?.last30daysExpense?.transactions || []}
    />
    <RecentIncomeWithCharts
      data={dashboardData?.last60daysIncome?.transactions?.slice(0, 4) || []}
      totalIncome={dashboardData?.totalIncome || 0}
    />
    <RecentIncome
      transactions={dashboardData?.last60daysIncome?.transactions || []}
      onSeeMore={() => navigate("/income")}
    />
  </div>
</DashboardLayout>

  );
};

export default Home;
