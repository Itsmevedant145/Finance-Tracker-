const ExcelJS = require("exceljs");
const User = require("../models/User");
const Expense = require("../models/Expense");
const client = require("../config/redis"); // Redis client

const expenseController = {
  // Add expense
  addExpense: async (req, res) => {
    const userId = req.user.id;
    try {
      const { icon, category, amount, date } = req.body;
      if (!category || !amount || !date) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const newExpense = await Expense.create({
        userId,
        icon,
        category,
        amount,
        date
      });

      // Invalidate Redis cache for this user's dashboard
      await client.del(`dashboard:${userId}`);
      console.log(`Redis cache for dashboard:${userId} deleted after adding expense`);

      res.status(200).json(newExpense);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all expenses
  getAllExpense: async (req, res) => {
    const userId = req.user.id;
    try {
      // Optional: Check Redis cache for expenses list (testing purpose)
      const cachedExpenses = await client.get(`expenses:${userId}`);
      if (cachedExpenses) {
        console.log('Serving expenses from Redis cache');
        return res.status(200).json(JSON.parse(cachedExpenses));
      }

      const expenses = await Expense.find({ userId }).sort({ date: -1 });

      // Cache expenses for 5 seconds (testing)
      await client.setEx(`expenses:${userId}`, 5, JSON.stringify(expenses));

      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete expense
  deleteExpense: async (req, res) => {
    const userId = req.user.id;
    try {
      const deletedExpense = await Expense.findOneAndDelete({
        _id: req.params.id,
        userId
      });

      if (!deletedExpense) {
        return res.status(404).json({ message: "Expense not found or permission denied" });
      }

      // Invalidate Redis cache for this user's dashboard
      await client.del(`dashboard:${userId}`);
      console.log(`Redis cache for dashboard:${userId} deleted after deleting expense`);

      res.status(200).json({ message: "Expense deleted", deleted: deletedExpense });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Download expenses as Excel
  downloadExpenseExcel: async (req, res) => {
    const userId = req.user.id;
    try {
      const expenses = await Expense.find({ userId }).sort({ date: -1 });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Expenses");

      // Add header row
      worksheet.columns = [
        { header: "Icon", key: "icon", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 15 }
      ];

      // Add rows
      expenses.forEach(item => {
        worksheet.addRow({
          icon: item.icon,
          category: item.category,
          amount: item.amount,
          date: new Date(item.date).toLocaleDateString()
        });
      });

      const filePath = "Expense.xlsx";
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, err => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "File download error" });
        }
      });
    } catch (error) {
      console.error("Excel generation error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

module.exports = expenseController;