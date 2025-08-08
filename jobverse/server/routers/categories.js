const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//lấy dữ liệu ngành nghề
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành nghề' });
  }
});

module.exports = router;
