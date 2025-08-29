const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');

// Lấy danh sách tin của công ty
router.get("/jobs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // user_id từ token

    // Lấy company_id của user
    const companyResult = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ công ty" });
    }

    const companyId = companyResult.rows[0].id;

    // Lấy danh sách job_posts của công ty
    const jobsResult = await pool.query(
      `SELECT *
       FROM job_posts
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId]
    );

    res.json(jobsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Sửa tin
router.put("/jobs/:id", verifyToken, verifyRole("nhatuyendung","admin"), async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { title, salary, category_id, location_id, job_type_id, description, deadline, status } = req.body;

    // Lấy company_id
    const companyResult = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ công ty" });
    }

    const companyId = companyResult.rows[0].id;

    // Cập nhật tin
    const updateResult = await pool.query(
      `UPDATE job_posts
       SET title = $1, salary = $2, category_id = $3, location_id = $4,
           job_type_id = $5, description = $6, deadline = $7, status = $8
       WHERE id = $9 AND company_id = $10
       RETURNING *`,
      [title, salary, category_id, location_id, job_type_id, description, deadline, status, jobId, companyId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(403).json({ message: "Không có quyền sửa tin này" });
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Xóa tin
router.delete("/jobs/:id", verifyToken, verifyRole("nhatuyendung","admin"), async (req, res) => {
 try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Lấy company_id của user
    const companyResult = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hồ sơ công ty" });
    }

    const companyId = companyResult.rows[0].id;

    // Xóa tin (chỉ cho phép xóa nếu là tin của công ty này)
    const deleteResult = await pool.query(
      "DELETE FROM job_posts WHERE id = $1 AND company_id = $2 RETURNING *",
      [jobId, companyId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(403).json({ message: "Không có quyền xóa tin này" });
    }

    res.json({ message: "Xóa tin thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
