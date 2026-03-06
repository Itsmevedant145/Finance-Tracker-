const ExcelJS = require("exceljs");
const User = require("../models/User");
const Income = require("../models/Income");
const client = require("../config/redis"); // Redis client

const incomeController = {
  // Add income
  addIncome: async (req, res) => {
    const userId = req.user.id;
    try {
      const { icon, source, amount, date } = req.body;
      if (!source || !amount || !date) {
        return res.status(400).json({ message: "Please fill all required fields" });
      }

      const newIncome = await Income.create({
        userId,
        icon,
        source,
        amount,
        date
      });

      // Invalidate Redis dashboard cache
      await client.del(`dashboard:${userId}`);
      console.log(`Redis cache for dashboard:${userId} deleted after adding income`);

      res.status(200).json(newIncome);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all incomes
  getAllIncome: async (req, res) => {
    const userId = req.user.id;
    try {
      // Optional: check Redis cache for income list (testing)
      const cachedIncomes = await client.get(`income:${userId}`);
      if (cachedIncomes) {
        console.log('Serving incomes from Redis cache');
        return res.status(200).json(JSON.parse(cachedIncomes));
      }

      const incomes = await Income.find({ userId }).sort({ date: -1 });

      // Cache incomes for 5 seconds (testing)
      await client.setEx(`income:${userId}`, 5, JSON.stringify(incomes));

      res.status(200).json(incomes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete income
  deleteIncome: async (req, res) => {
    const userId = req.user.id;
    try {
      const deletedIncome = await Income.findOneAndDelete({
        _id: req.params.id,
        userId
      });

      if (!deletedIncome) {
        return res.status(404).json({ message: "Income not found or permission denied" });
      }

      // Invalidate Redis dashboard cache
      await client.del(`dashboard:${userId}`);
      console.log(`Redis cache for dashboard:${userId} deleted after deleting income`);

      res.status(200).json({ message: "Income deleted", deleted: deletedIncome });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Download incomes as Excel
  downloadIncomeExcel: async (req, res) => {
    const userId = req.user.id;
    try {
      const incomes = await Income.find({ userId }).sort({ date: -1 });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Income");

      worksheet.columns = [
        { header: "Icon", key: "icon", width: 15 },
        { header: "Source", key: "source", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 15 }
      ];

      incomes.forEach(item => {
        worksheet.addRow({
          icon: item.icon,
          source: item.source,
          amount: item.amount,
          date: new Date(item.date).toLocaleDateString()
        });
      });

      const filePath = "Income.xlsx";
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

module.exports = incomeController;