const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Lấy danh sách đơn ứng tuyển của công ty
router.get("/manage-applications", verifyToken, verifyRole("nhatuyendung"), async (req, res) => {
  try {
    // Lấy company_id
    const userId = req.user.id;
    const companyResult = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hồ sơ công ty." });
    }

    const companyId = companyResult.rows[0].id;

    // Lấy danh sách applications
    const applicationsResult = await pool.query(
      `SELECT
          a.id AS application_id,
          u.id as candidate_id,
          j.title AS job_title,
          p.full_name,
          u.email,
          a.cv_url,
          a.applied_at,
          a.status
      FROM applications a
      JOIN job_posts j ON a.job_post_id = j.id
      JOIN users u ON a.candidate_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE j.company_id = $1
      ORDER BY a.applied_at DESC`,
      [companyId]
    );

    res.json(applicationsResult.rows);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn ứng tuyển:", err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
});

// Cập nhật trạng thái đơn ứng tuyển
router.put("/manage-applications/:applicationId/status", verifyToken, verifyRole("nhatuyendung"), async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  // Kiểm tra status hợp lệ
  const validStatuses = ["đã duyệt", "từ chối", "đã nộp"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ." });
  }

  try {
    // Kiểm tra xem đơn ứng tuyển có thuộc công ty user đang đăng nhập không
    const userId = req.user.id;
    const companyResult = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hồ sơ công ty." });
    }
    const companyId = companyResult.rows[0].id;

    // Kiểm tra đơn ứng tuyển có thuộc công ty
    const checkApp = await pool.query(
      `SELECT a.id FROM applications a
       JOIN job_posts j ON a.job_post_id = j.id
       WHERE a.id = $1 AND j.company_id = $2`,
      [applicationId, companyId]
    );

    if (checkApp.rows.length === 0) {
      return res.status(403).json({ error: "Không có quyền cập nhật đơn ứng tuyển này." });
    }

    // Cập nhật trạng thái
    const updateResult = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, applicationId]
    );

    res.json({ message: "Cập nhật trạng thái thành công.", application: updateResult.rows[0] });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
});

module.exports = router;
