const express = require('express');
const router = express.Router();
const { getSpendingInsights } = require('../controllers/insightsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/spending-insights', protect, getSpendingInsights);



module.exports = router;
