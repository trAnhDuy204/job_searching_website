const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');

// 1. QUẢN LÝ NGƯỜI DÙNG

// Lấy danh sách user
router.get("/users",verifyToken,verifyRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.username, u.email, u.role, u.created_at,
             p.full_name, p.phone, c.company_name
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN company_profiles c ON u.id = c.user_id
      ORDER BY u.created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
  }
});

// Xem chi tiết user
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.*, p.full_name, p.gender, p.dob, p.phone, p.address, p.avatar_url, p.description,
              c.company_name, c.industry, c.company_size, c.website, c.address as company_address
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN company_profiles c ON u.id = c.user_id
       WHERE u.id = $1;`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết user" });
  }
});

// Xóa user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa user" });
  }
});


// 2. QUẢN LÝ TIN TUYỂN DỤNG

// Lấy danh sách job
router.get("/job-posts", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT jp.id, jp.title, jp.deadline, jp.status, jp.created_at,
             c.company_name, cat.name AS category, l.name AS location, t.name AS job_type
      FROM job_posts jp
      JOIN company_profiles c ON jp.company_id = c.id
      LEFT JOIN categories cat ON jp.category_id = cat.id
      LEFT JOIN job_locations l ON jp.location_id = l.id
      LEFT JOIN job_types t ON jp.job_type_id = t.id
      ORDER BY jp.created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách job" });
  }
});

// Xem chi tiết job
router.get("/job-posts/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT jp.*, c.company_name, cat.name AS category, l.name AS location, t.name AS job_type
       FROM job_posts jp
       JOIN company_profiles c ON jp.company_id = c.id
       LEFT JOIN categories cat ON jp.category_id = cat.id
       LEFT JOIN job_locations l ON jp.location_id = l.id
       LEFT JOIN job_types t ON jp.job_type_id = t.id
       WHERE jp.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Không tìm thấy job" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết job" });
  }
});

// Cập nhật trạng thái job
router.put("/job-posts/status", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    await pool.query(
       `UPDATE job_posts 
       SET status = 'hết hạn'
       WHERE deadline < NOW() AND status != 'hết hạn'`, 
    );
    res.json({ message: "Cập nhật trạng thái job thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật job" });
  }
});

// Xóa job
router.delete("/job-posts/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM job_posts WHERE id = $1", [id]);
    res.json({ message: "Xóa job thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa job" });
  }
});


// 3. QUẢN LÝ CÔNG TY

// Lấy danh sách công ty
router.get("/companies", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.company_name, c.industry, c.company_size, 
             c.website, c.address, c.created_at, u.email
      FROM company_profiles c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách công ty" });
  }
});

// Xem chi tiết công ty
router.get("/companies/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.email 
       FROM company_profiles c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Không tìm thấy công ty" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết công ty" });
  }
});

// Xóa công ty
router.delete("/companies/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM company_profiles WHERE id = $1", [id]);
    res.json({ message: "Xóa công ty thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa công ty" });
  }
});

module.exports = router;
