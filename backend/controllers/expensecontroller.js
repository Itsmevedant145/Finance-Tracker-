const xlsx = require("xlsx"); // Import the xlsx library for Excel file handling
const User = require("../models/User");
const Expense = require("../models/Expense"); // Corrected model import

const expenseController = {
  // Add expense source
  addExpense: async (req, res) => {
    const userId = req.user.id; // Get user ID from the request
    try {
     // Destructure the request body
      const { icon, category, amount, date } = req.body; // ✅ changed 'source' to 'category'
      if (!category || !amount || !date) 
        {
        return res.status(400).json({ message: "Please fill all fields" });
      }
      
      const newExpense = await Expense.create({
        userId,
        icon,
        category, // ✅
        amount,
        date
      });
      

      res.status(200).json(newExpense); // Send the response back
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all expenses
  getAllExpense: async (req, res) => {
    const userId = req.user.id;
    try {
      const expenses = await Expense.find({ userId }).sort({ date: -1 }); // Fetch all expenses for the user
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
        userId: userId,
      });

      if (!deletedExpense) {
        return res.status(404).json({ message: "Expense not found or you don't have permission to delete it" });
      }

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

      // Prepare the data for Excel
      const data = expenses.map((item) => ({
        Icon: item.icon,
        Source: item.source,
        Amount: item.amount,
        Date: new Date(item.date).toLocaleDateString(),
      }));

      // Generate Excel workbook
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");

      const filePath = "Expense.xlsx"; // Safer to use a filepath
      xlsx.writeFile(workbook, filePath);

      res.download(filePath, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "File download error" });
        } else {
          console.log("File downloaded successfully");
        }
      });
    } catch (error) {
      console.error('Excel generation error:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

module.exports = expenseController;
