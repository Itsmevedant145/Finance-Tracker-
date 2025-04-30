const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomecontroller");

const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

// ✅ Routes
router.post("/add", protect, addIncome);  // Use the correct case
router.get("/getall", protect, getAllIncome);  // Use the correct case
router.get("/downloadexcel", protect,  downloadIncomeExcel);  // Use the correct case
router.delete("/:id", protect, deleteIncome);  // Use the correct case

module.exports = router;
