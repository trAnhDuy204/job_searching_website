const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../config/db");
const { verifyRole, verifyToken } = require("../middleware/authMiddleware");

// Cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage cho CV
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cv_uploads",
    resource_type: "raw", // cho phép PDF/DOC/DOCX
    format: async (req, file) => {
      const ext = file.originalname.split(".").pop();
      return ext; // giữ đúng định dạng file
    },
    public_id: (req, file) =>
      `${req.user.id}-${Date.now()}`,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = require("path").extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Chỉ cho phép file PDF, DOC, DOCX"));
    }
    cb(null, true);
  },
});


// API vừa upload CV vừa nộp đơn (lấy job_post_id từ job_posts)
router.post("/apply", verifyToken, verifyRole("ungvien"), upload.single("cv"), async (req, res) => {

    const { job_title } = req.body; //Lấy tên job từ form thay vì id
    const candidate_id = req.user.id;

    if (!job_title || !req.file || !req.file.path) {
      return res.status(400).json({ error: "Thiếu job_title hoặc file CV" });
    }

    const cvUrl = req.file.path; // Lấy URL từ Cloudinary

    try {
    // Lấy job_post_id
    const jobResult = await pool.query(
      `SELECT id FROM job_posts WHERE title = $1 LIMIT 1`,
      [job_title]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy công việc này" });
    }

    const job_post_id = jobResult.rows[0].id;

    // Kiểm tra đã nộp chưa
    const checkExist = await pool.query(
      `SELECT id FROM applications WHERE job_post_id = $1 AND candidate_id = $2`,
      [job_post_id, candidate_id]
    );

    if (checkExist.rows.length > 0) {
      return res.status(400).json({ error: "Bạn đã nộp đơn cho công việc này rồi" });
    }

    // Lưu vào DB
    const result = await pool.query(
      `INSERT INTO applications (job_post_id, candidate_id, cv_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [job_post_id, candidate_id, cvUrl]
    );

    res.status(201).json({
      message: "Upload CV và nộp đơn thành công",
      cv_url: cvUrl,
      application: result.rows[0],
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
