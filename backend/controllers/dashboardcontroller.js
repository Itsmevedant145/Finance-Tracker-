const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types, isValidObjectId } = require('mongoose');

// Get dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));
        
        // Get all income and expenses for the user
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);
        console.log("totalIncome", totalIncome, "userId:", userId, "isValidObjectId:", isValidObjectId(userId), "userObjectId:", userObjectId);
        
        // Get all expenses for the user
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);
        console.log("totalExpense", totalExpense, "userId:", userId, "isValidObjectId:", isValidObjectId(userId), "userObjectId:", userObjectId);
        
        // Get the last 60 days income and expenses
        const last60daysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        
        const incomeLast60days = last60daysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );
        
        const last30daysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        
        const expenseLast30days = last30daysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );
        
        const lastTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); // Sort by date descending

        // final response
        res.json({
            totalBalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpense: totalExpense[0]?.totalExpense || 0,
            last30daysExpense: {
                total: expenseLast30days,
                transactions: last30daysExpenseTransactions,
            },
            last60daysIncome: {
                total: incomeLast60days,
                transactions: last60daysIncomeTransactions,
            },
            lastTransactions: lastTransactions,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};