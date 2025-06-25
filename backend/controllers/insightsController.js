const Expense = require('../models/Expense');
const moment = require('moment');

exports.getSpendingInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Date ranges
    const currentMonthStart = moment().startOf('month').toDate();
    const currentMonthEnd = moment().endOf('month').toDate();

    const prevMonthStart = moment().subtract(1, 'month').startOf('month').toDate();
    const prevMonthEnd = moment().subtract(1, 'month').endOf('month').toDate();

    const sixMonthsAgo = moment().subtract(5, 'months').startOf('month').toDate(); // include this month = 6 total

    // Fetch relevant expense data
    const [currentMonthExpenses, prevMonthExpenses, lastSixMonthsExpenses] = await Promise.all([
      Expense.find({ userId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } }),
      Expense.find({ userId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } }),
      Expense.find({ userId, date: { $gte: sixMonthsAgo } })
    ]);

    // 1. Top Spending Category for Current Month
    const categoryTotals = {};
    currentMonthExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let topCategory = 'None';
    let topAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > topAmount) {
        topAmount = amount;
        topCategory = category;
      }
    }

    // 2. Month-over-Month Comparison
    const totalCurrent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPrev = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    let comparisonPercentage = 0;
    let comparisonDirection = 'same';

    if (totalPrev > 0) {
      const diff = totalCurrent - totalPrev;
      comparisonPercentage = Math.round(Math.abs(diff / totalPrev) * 100);
      comparisonDirection = diff > 0 ? 'up' : 'down';
    }

    // 3. Recurring Expenses
    const recurringExpenses = detectRecurringExpenses(lastSixMonthsExpenses);

    // 4. Monthly Trends for Last 6 Months
    const monthMap = {};

    for (let i = 5; i >= 0; i--) {
      const label = moment().subtract(i, 'months').format('MMM');
      monthMap[label] = 0;
    }

    lastSixMonthsExpenses.forEach(exp => {
      const month = moment(exp.date).format('MMM');
      if (monthMap[month] !== undefined) {
        monthMap[month] += exp.amount;
      }
    });

    const monthlyTrends = Object.entries(monthMap).map(([month, total]) => ({
      month,
      total
    }));

    // Final JSON Response
    res.json({
      topCategory,
      topAmount,
      comparisonPercentage,
      comparisonDirection,
      recurringExpenses,
      monthlyTrends
    });

  } catch (err) {
    console.error('❌ Error in getSpendingInsights:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};

// 🔁 Recurring Detection Logic
function detectRecurringExpenses(expenses) {
  const groups = {};

  expenses.forEach(exp => {
    const key = `${exp.category}_${exp.amount}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(exp);
  });

  const recurring = [];

  for (const [key, records] of Object.entries(groups)) {
    const months = new Set(records.map(e => moment(e.date).format('YYYY-MM')));
    if (months.size >= 3) {
      const [category, amount] = key.split('_');
      recurring.push({
        category,
        amount: Number(amount),
        frequency: 'monthly'
      });
    }
  }

  return recurring;
}
