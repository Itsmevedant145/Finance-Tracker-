const express = require("express");
const {
  addExpense,
  getAllExpense,
    deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expensecontroller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Routes
router.post("/add", protect, addExpense);  // Use the correct case
router.get("/getall", protect, getAllExpense);  // Use the correct case
router.get("/downloadexcel", protect, downloadExpenseExcel);  // Use the correct case
router.delete("/:id", protect, deleteExpense);  // Use the correct case

module.exports = router;
