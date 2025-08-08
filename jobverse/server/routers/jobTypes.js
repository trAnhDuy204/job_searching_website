// routers/jobTypes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//lấy dữ liệu loại công việc
router.get('/job-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_types');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy loại công việc' });
  }
});

module.exports = router;
