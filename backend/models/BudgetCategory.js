const mongoose = require('mongoose');

const BudgetCategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'wallet'
  },
  plannedAmount: {
    type: Number,
    required: true
  },
  currentSpent: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, { timestamps: true });

module.exports = mongoose.model('BudgetCategory', BudgetCategorySchema);