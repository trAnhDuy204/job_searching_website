const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');

// Tạo tin tuyển dụng mới
router.post('/', verifyToken, verifyRole("nhatuyendung","admin"), async (req, res) => {
  const {
    title,
    salary,
    deadline,
    category_id,
    location_id,
    job_type_id,
    description
  } = req.body;

  try {
    // Lấy company_id từ user_id đang đăng nhập
    const companyResult = await pool.query(
      `SELECT id FROM company_profiles WHERE user_id = $1`,
      [req.user.id] // req.user.id lấy từ verifyToken
    );

    if (companyResult.rows.length === 0) {
      return res.status(400).json({ message: 'Không tìm thấy hồ sơ công ty cho tài khoản này.' });
    }

    const company_id = companyResult.rows[0].id;

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


// lấy danh sách jobs để làm jobCard
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  try {
    const jobs= await pool.query(
      `
        SELECT 
          jp.id,
          jp.title,
          jp.salary,
          jp.description,
          jp.deadline,
          cp.company_name,
          cp.logo_url AS logo,
          cat.name AS category,
          loc.name AS location,
          jt.name AS job_type
        FROM job_posts jp
        JOIN company_profiles cp ON jp.company_id = cp.id
        JOIN categories cat ON jp.category_id = cat.id
        JOIN job_locations loc ON jp.location_id = loc.id
        JOIN job_types jt ON jp.job_type_id = jt.id
        WHERE jp.status = 'hoạt động'
        ORDER BY jp.created_at DESC
        LIMIT $1 OFFSET $2
      `, 
    [limit, offset]);


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
