const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Tạo tin tuyển dụng mới
router.post('/', async (req, res) => {
  const {
    title,
    salary,
    deadline,
    category_id,
    location_id,
    job_type_id,
    company_id,
    description
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO job_posts 
        (title, salary, deadline, category_id, location_id, job_type_id, company_id, description, status, created_at)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, 'hoạt động', NOW())
       RETURNING *`,
      [title, salary, deadline, category_id, location_id, job_type_id, company_id, description]
    );

    res.status(201).json({
      message: 'Tạo tin tuyển dụng thành công',
      job: result.rows[0]
    });
  } catch (err) {
    console.error('Lỗi tạo job:', err.message);
    res.status(500).json({ message: 'Lỗi server khi tạo tin tuyển dụng.' });
  }
});


// Hàm xử lý lấy danh sách jobs
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  try {
    const jobs = await pool.query(`
        SELECT jp.id, jp.title, jp.salary, jp.deadline,
            c.name AS category,
            l.name AS location,
            jt.name AS job_type,
            cp.company_name AS company_name,
            cp.logo_url AS logo
        FROM job_posts jp
        LEFT JOIN categories c ON c.id = jp.category_id
        LEFT JOIN job_locations l ON l.id = jp.location_id
        LEFT JOIN job_types jt ON jt.id = jp.job_type_id
        LEFT JOIN company_profiles cp ON cp.id = jp.company_id
        WHERE jp.status = 'hoạt động'
        ORDER BY jp.created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);


    const total = await pool.query(`SELECT COUNT(*) FROM job_posts WHERE status = $1`, ['hoạt động']);

    res.json({
      jobs: jobs.rows,
      total: parseInt(total.rows[0].count),
      page,
      totalPages: Math.ceil(total.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu job.' });
  }
});

module.exports = router;
