import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashoboardLayout';
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
import ExpenseTranscations from '../../components/Dashboard/ExpenseTranscations';
import Last30daysExpense from '../../components/Dashboard/Last30daysExpense';
import RecentIncomeWithCharts from '../../components/Dashboard/RecentIncomeWithCharts';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import QuoteGate from '../../components/Dashboard/ModernQuoteGate'; // Import QuoteGate component
import SpendingInsights from '../../components/layouts/SpendingInsights';


const Home = () => {
  useUserAuth(); // Ensure user is authenticated
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_Path.DASHBOARD.GET_USER_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      // Set a timeout of 3 seconds to unlock the dashboard after data is fetched
      const timer = setTimeout(() => {
        setUnlocked(true);
      }, 2500); // 3000 milliseconds = 3 seconds

      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [dashboardData]); // This effect runs when dashboardData is updated

  // Show QuoteGate if data is still loading
  if (!dashboardData) {
    return <QuoteGate onUnlock={() => setUnlocked(true)} />;
  }

  // Show full dashboard once unlocked
  if (!unlocked) {
    return <QuoteGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <DashboardLayout activeMenu="Dashboard" dashboardData={dashboardData}>
      {/* First row — 3 cards side-by-side */}
      <div className="infocontainer">
        <InfoCard
          icon={<IoMdCard className="icon" />}
          label="Total Balance"
          value={addThousandSeparator(dashboardData?.totalBalance || 0)}
          themeClass="theme-blue"
        />
        <InfoCard
          icon={<LuHandCoins className="icon" />}
          label="Total Income"
          value={addThousandSeparator(dashboardData?.totalIncome || 0)}
          themeClass="theme-green"
        />
        <InfoCard
          icon={<LuWalletMinimal className="icon" />}
          label="Total Expense"
          value={addThousandSeparator(dashboardData?.totalExpense || 0)}
          themeClass="theme-red"
        />
      </div>

      {/* All other components in 2-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <FinanceOverveiw
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpense || 0}
        />
        <RecentTransactions
          transactions={dashboardData?.lastTransactions || []}
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
      <SpendingInsights >

      </SpendingInsights>


    </DashboardLayout>
  );
};

export default Home;
