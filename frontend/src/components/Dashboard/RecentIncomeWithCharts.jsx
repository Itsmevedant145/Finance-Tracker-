import React, { useState, useEffect } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"];

const RecentIncomeWithCharts = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState([]);

    // Prepare the chart data based on the incoming data
    const prepareChartData = () => {
        if (!data || data.length === 0) return; // Make sure data is valid before processing
        const dataArr = data.map((item) => ({
            name: item?.source?.includes('@') ? 'Other Income' : item?.source || 'Income',  // Replace email addresses with 'Other Income'
            amount: item?.amount,
        }));
        
        // Only update state if dataArr has valid entries
        if (dataArr.length > 0) {
            setChartData(dataArr);
        }
        
        // Log the prepared chart data for debugging
        console.log("Prepared chart data:", dataArr);
    };

    // Effect hook to prepare chart data when `data` changes
    useEffect(() => {
        prepareChartData();
    }, [data]); // Dependency array ensures this runs whenever `data` changes

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 60 Days Income</h5>
            </div>

            {/* Pie chart displaying the total income data */}
            <CustomPieChart 
                data={chartData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    );
}

export default RecentIncomeWithCharts;
