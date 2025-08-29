const express = require("express");
const pool = require("../config/db");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const router = express.Router();

//lưu và bỏ lưu tin
router.post("/toggle", verifyToken, verifyRole("ungvien"), async (req, res) => {
  const userId = req.user.id;
  const { job_post_id } = req.body;

  if (!job_post_id) {
    return res.status(400).json({ error: "Thiếu job_post_id" });
  }

  try {
    // Kiểm tra job tồn tại và đang hoạt động (tuỳ bạn có muốn ràng buộc thêm không)
    const job = await pool.query("SELECT id FROM job_posts WHERE id = $1 LIMIT 1", [job_post_id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy tin tuyển dụng" });
    }

    // Thử xoá trước: nếu đã có sẽ xoá -> nghĩa là chuyển về "bỏ lưu"
    const del = await pool.query(
      "DELETE FROM saved_jobs WHERE user_id = $1 AND job_post_id = $2",
      [userId, job_post_id]
    );

    if (del.rowCount > 0) {
      return res.json({ saved: false, message: "Đã bỏ lưu tin" });
    }

    // Nếu chưa có thì chèn -> "đã lưu"
    await pool.query(
      `INSERT INTO saved_jobs (user_id, job_post_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, job_post_id) DO NOTHING`,
      [userId, job_post_id]
    );
    return res.json({ saved: true, message: "Đã lưu tin" });
  } catch (err) {
    console.error("toggle save error:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

//lấy id tin đã lưu
router.get("/ids", verifyToken, verifyRole("ungvien"), async (req, res) => {
  const userId = req.user.id;
  try {
    const rs = await pool.query(
      "SELECT job_post_id FROM saved_jobs WHERE user_id = $1 ORDER BY saved_at DESC",
      [userId]
    );
    res.json(rs.rows.map(r => r.job_post_id));
  } catch (err) {
    console.error("get ids error:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

//lấy danh sách tin đã lưu
router.get("/list", verifyToken, verifyRole("ungvien"), async (req, res) => {
  const userId = req.user.id;
  try {
    const rs = await pool.query(
      `
      SELECT 
            jp.id,
            cp.id as company_id,
            jp.title,
            jp.salary,
            jp.description,
            jp.deadline,
            jp.status,
            cp.company_name,
            cp.logo_url AS logo,
            cat.name AS category,
            loc.name AS location,
            jt.name AS job_type,
            sj.saved_at
      FROM saved_jobs sj
      JOIN job_posts jp ON sj.job_post_id = jp.id
      JOIN company_profiles cp ON jp.company_id = cp.id
      JOIN categories cat ON jp.category_id = cat.id
      JOIN job_locations loc ON jp.location_id = loc.id
      JOIN job_types jt ON jp.job_type_id = jt.id
      WHERE sj.user_id = $1
      ORDER BY sj.saved_at DESC;
      `,
      [userId]
    );
    res.json(rs.rows);
  } catch (err) {
    console.error("get saved list error:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

module.exports = router;
