const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Monthly Budget'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  totalBudget: {
    type: Number,
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BudgetCategory'
  }],
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Planned'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);