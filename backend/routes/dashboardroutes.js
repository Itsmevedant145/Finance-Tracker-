const express = require('express');
const {getDashboardData} = require('../controllers/dashboardcontroller');

const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

router.get("/", protect, getDashboardData); // ✅ Use the correct case for 'getdashboardData'

module.exports = router; // ✅ Export the router