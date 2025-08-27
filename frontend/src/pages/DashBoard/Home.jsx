import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import { IoMdCard } from 'react-icons/io';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { InfoCard } from '../../components/cards/InfoCard';
import { addThousandSeparator } from '../../utils/helper';
import HeatmapCalculator from '../../components/Dashboard/HeatmapCalculator';import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverveiw from '../../components/Dashboard/FinanceOverveiw';

import Last30daysExpense from '../../components/Dashboard/Last30daysExpense';
import RecentIncomeWithCharts from '../../components/Dashboard/RecentIncomeWithCharts';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import QuoteGate from '../../components/Dashboard/ModernQuoteGate';
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
      const timer = setTimeout(() => {
        setUnlocked(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [dashboardData]);

  if (!dashboardData) {
    return <QuoteGate onUnlock={() => setUnlocked(true)} />;
  }

  if (!unlocked) {
    return <QuoteGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <DashboardLayout activeMenu="Dashboard" dashboardData={dashboardData}>
      {/* First row — 3 cards side-by-side */}
      
      {/* Main dashboard content - 2 column layout */}

      {/* First Row - Financial Overview and Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <FinanceOverveiw
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpense={dashboardData?.totalExpense || 0}
        />
        <RecentTransactions
          transactions={dashboardData?.lastTransactions?.slice(0, 3) || []}
          onSeeMore={() => navigate("/expense")}
        />
      </div>

      {/* Second Row - Income Charts and Expense Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <RecentIncomeWithCharts
          data={dashboardData?.last60daysIncome?.transactions?.slice(0, 4) || []}
          totalIncome={dashboardData?.totalIncome || 0}
        />
         <HeatmapCalculator
 last30daysExpense={dashboardData?.last30daysExpense}
  last60daysIncome={dashboardData?.last60daysIncome}
/>
      </div>

      {/* Third Row - Last 30 Days Expense and Recent Income */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <Last30daysExpense
          data={dashboardData?.last30daysExpense?.transactions?.slice(0, 4) || []}
        />
        <RecentIncome
          transactions={dashboardData?.last60daysIncome?.transactions?.slice(0, 3) || []}
          onSeeMore={() => navigate("/income")}
        />
      </div>

      {/* Fourth Row - Spending Insights (Full Width) */}
      <div className="mb-4">
        <SpendingInsights />
      </div>
    </DashboardLayout>
  );
};

export default Home;
