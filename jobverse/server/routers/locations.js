const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//lấy dữ liệu địa điểm
router.get('/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_locations');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy địa điểm' });
  }
});

module.exports = router;
