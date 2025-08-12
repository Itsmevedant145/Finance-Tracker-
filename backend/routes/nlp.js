const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/authmiddleware'); // 👈 Import your middleware

const router = express.Router();

router.post('/parse-transactions', protect, async (req, res) => { // 👈 Added protect
  const { texts } = req.body;
  console.log("Requesting classification for:", texts);

  try {
    const response = await axios.post('http://127.0.0.1:5000/classify', {
      texts,
    });

    console.log("Flask response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with Flask API:', error.message);
    res.status(500).json({ error: 'Failed to classify transactions' });
  }
});

module.exports = router;
