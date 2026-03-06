const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types, isValidObjectId } = require('mongoose');
const client = require('../config/redis'); // Redis client

// Get dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Check Redis cache first
        const cachedDashboard = await client.get(`dashboard:${userId}`);
        if (cachedDashboard) {
            console.log('Serving dashboard from Redis cache');
            return res.json(JSON.parse(cachedDashboard));
        }

        const userObjectId = new Types.ObjectId(String(userId));

        // 2. Get total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        console.log("totalIncome", totalIncome, "userId:", userId, "isValidObjectId:", isValidObjectId(userId), "userObjectId:", userObjectId);

        // 3. Get total expenses
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);

        console.log("totalExpense", totalExpense, "userId:", userId, "isValidObjectId:", isValidObjectId(userId), "userObjectId:", userObjectId);

        // 4. Last 60 days income
        const last60daysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60days = last60daysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // 5. Last 30 days expenses
        const last30daysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast30days = last30daysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // 6. Last transactions (5 income + 5 expense)
        const lastTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({ ...txn.toObject(), type: "income" })
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({ ...txn.toObject(), type: "expense" })
            ),
        ].sort((a, b) => b.date - a.date);

        // 7. Build final dashboard object
        const dashboardData = {
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
        };

        // 8. Store in Redis cache for 60 seconds
        await client.setEx(`dashboard:${userId}`, 60, JSON.stringify(dashboardData));

        // 9. Send response
        res.json(dashboardData);

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};