const Expense = require('../models/Expense');
const moment = require('moment');
require('dotenv').config();
// const { HfInference } = require('@huggingface/inference'); // ⚠️ commented out AI
// const hf = new HfInference(process.env.HF_API_KEY); // ⚠️ commented out AI

exports.getSpendingInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // ----------------------------
    // Date ranges
    // ----------------------------
    const currentMonthStart = moment().startOf('month').toDate();
    const currentMonthEnd = moment().endOf('month').toDate();
    const prevMonthStart = moment().subtract(1, 'month').startOf('month').toDate();
    const prevMonthEnd = moment().subtract(1, 'month').endOf('month').toDate();
    const sixMonthsAgo = moment().subtract(5, 'months').startOf('month').toDate();

    // ----------------------------
    // Fetch expense data
    // ----------------------------
    const [currentMonthExpenses, prevMonthExpenses, lastSixMonthsExpenses] = await Promise.all([
      Expense.find({ userId, date: { $gte: currentMonthStart, $lte: currentMonthEnd } }),
      Expense.find({ userId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } }),
      Expense.find({ userId, date: { $gte: sixMonthsAgo } })
    ]);

    // ----------------------------
    // Top Category
    // ----------------------------
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

    // ----------------------------
    // Month-over-Month Comparison
    // ----------------------------
    const totalCurrent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPrev = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    let comparisonPercentage = 0;
    let comparisonDirection = 'same';
    if (totalPrev > 0) {
      const diff = totalCurrent - totalPrev;
      comparisonPercentage = Math.round(Math.abs(diff / totalPrev) * 100);
      comparisonDirection = diff > 0 ? 'up' : 'down';
    }

    // ----------------------------
    // Recurring Expenses
    // ----------------------------
    const recurringExpenses = detectRecurringExpenses(lastSixMonthsExpenses);

    // ----------------------------
    // Monthly Trends
    // ----------------------------
    const monthMap = {};
    for (let i = 5; i >= 0; i--) {
      const label = moment().subtract(i, 'months').format('MMM');
      monthMap[label] = 0;
    }
    lastSixMonthsExpenses.forEach(exp => {
      const month = moment(exp.date).format('MMM');
      if (monthMap[month] !== undefined) monthMap[month] += exp.amount;
    });
    const monthlyTrends = Object.entries(monthMap).map(([month, total]) => ({ month, total }));

    // ----------------------------
    // Identify overspending (example)
    // ----------------------------
    const overspendingCategories = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 1000) // Threshold example
      .map(([category, amount]) => ({ category, amount, suggestedBudget: Math.round(amount * 0.8) }));

    // ----------------------------
    // AI Insights ⚠️ temporarily removed
    // ----------------------------
    // const prompt = `...`;
    // const aiResponse = await hf.textGeneration({...});
    // const aiInsights = aiResponse.generated_text;

    // ----------------------------
    // Final JSON Response
    // ----------------------------
    res.json({
      topCategory,
      topAmount,
      comparisonPercentage,
      comparisonDirection,
      recurringExpenses,
      monthlyTrends,
      overspendingCategories,
      aiInsights: 'AI insights temporarily disabled'
    });

  } catch (err) {
    console.error('❌ Error in getSpendingInsights:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};

// ----------------------------
// Recurring Detection
// ----------------------------
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