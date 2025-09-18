const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const pool = require("../config/db");
const { verifyRole, verifyToken } = require("../middleware/authMiddleware");

// Cấu hình multer để lưu file CV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv"); // Thư mục lưu CV
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Chỉ cho phép file PDF, DOC, DOCX"));
    }
    cb(null, true);
  }
});
//hàm xóa file rác
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Lỗi khi xóa file:", err);
    } else {
      console.log("Đã xóa file:", filePath);
    }
  });
}


// API vừa upload CV vừa nộp đơn (lấy job_post_id từ job_posts)
router.post("/apply", verifyToken, verifyRole("ungvien"), upload.single("cv"), async (req, res) => {

    const { job_title } = req.body; //Lấy tên job từ form thay vì id
    const candidate_id = req.user.id;

    if (!job_title || !req.file) {
      return res
        .status(400)
        .json({ error: "Thiếu thông tin job_title hoặc file CV" });
    }

    const cvUrl = `/uploads/cv/${req.file.filename}`;

    try {
      // Lấy job_post_id từ job_posts
      const jobResult = await pool.query(
        `SELECT id FROM job_posts WHERE title = $1 LIMIT 1`,
        [job_title]
      );

      if (jobResult.rows.length === 0) {
        //Xóa file CV khi không tìm thấy jobPost
        deleteFile(req.file.path);
        return res.status(404).json({ error: "Không tìm thấy công việc này" });
      }

      const job_post_id = jobResult.rows[0].id;

      // Kiểm tra đã nộp chưa
      const checkExist = await pool.query(
        `SELECT id FROM applications WHERE job_post_id = $1 AND candidate_id = $2`,
        [job_post_id, candidate_id]
      );

      if (checkExist.rows.length > 0) {
        //Xóa file CV khi đã nộp rồi
        deleteFile(req.file.path);
        return res
          .status(400)
          .json({ error: "Bạn đã nộp đơn cho công việc này rồi" });
      }

      // Thêm đơn ứng tuyển
      const result = await pool.query(
        `INSERT INTO applications (job_post_id, candidate_id, cv_url)
         VALUES ($1, $2, $3) RETURNING *`,
        [job_post_id, candidate_id, cvUrl]
      );

      res.status(201).json({
        message: "Upload CV và nộp đơn thành công",
        application: result.rows[0]
      });
    } catch (err) {
      console.error("Lỗi khi nộp đơn:", err);
      res.status(500).json({ error: "Lỗi khi xử lý nộp đơn" });
    }
  }
);

// Lấy danh sách đơn ứng tuyển của chính ứng viên
router.get("/candidate", verifyToken, verifyRole("ungvien"), async (req, res) => {
  try {
    const candidateId = req.user.id; // lấy từ token

    const result = await pool.query(
      `SELECT a.*, j.title AS job_title, c.company_name
       FROM applications a
       JOIN job_posts j ON a.job_post_id = j.id
       JOIN company_profiles c ON j.company_id = c.id
       WHERE a.candidate_id = $1
       ORDER BY a.applied_at DESC`,
      [candidateId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi khi lấy đơn ứng tuyển:", err);
    res.status(500).json({ error: "Lỗi khi lấy đơn ứng tuyển" });
  }
});


module.exports = router;
