const xlsx = require("xlsx"); // Import the xlsx library for Excel file handling
const User = require("../models/User");
const Income = require("../models/Income");

const incomeController = {
  // Add income source
  addIncome: async (req, res) => {
    const userId = req.user.id; // Get user ID from the request
    try {
      const { icon, source, amount, date } = req.body; // Destructure the request body
      if (!source || !amount || !date) { // Removed !icon check
  return res.status(400).json({ message: "Please fill all required fields" });
}


      const newIncome = await Income.create({
        userId,
        icon,
        source,
        amount,
        date
      });

      await newIncome.save(); // Save the new income source to the database
      res.status(200).json(newIncome); // Send the response back
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all income
  getAllIncome: async (req, res) => {
    // Your logic here
    const userId = req.user.id; // Get user ID from the request
    try {
      const incomes = await Income.find({ userId }).sort({date : -1}); // Fetch all income sources for the user
      res.status(200).json(incomes); // Send the response back
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }

  },

  // Delete income source
  // Delete income source
deleteIncome: async (req, res) => {
  const userId = req.user.id; // Get user ID from the request
  try {
      // Find the income that matches both the ID and the user ID
      const deletedIncome = await Income.findOneAndDelete({
          _id: req.params.id,
          userId: userId
      });
      
      if (!deletedIncome) {
          return res.status(404).json({ message: "Income not found or you don't have permission to delete it" });
      }
      
      res.status(200).json({ message: "Income deleted", deleted: deletedIncome });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
}
 ,
  

  // Download income source as Excel
// Download income source as Excel
// Download income source as Excel
downloadIncomeExcel: async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    
    // Prepare the data for Excel
    const data = income.map((item) => ({
      Icon: item.icon,
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
    }));
    
    // Generate Excel workbook in memory
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Income");
    
  xlsx.writeFile(workbook, "Income.xlsx"); // Write the workbook to a file
  res.download("Income.xlsx", (err) => {
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

module.exports = incomeController;
