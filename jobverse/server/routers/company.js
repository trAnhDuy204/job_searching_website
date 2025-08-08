const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken , verifyRole} = require("../middleware/authMiddleware");

// Lấy thông tin công ty của user hiện tại
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Kiểm tra xem đã có hồ sơ chưa
    let result = await pool.query(
      "SELECT * FROM company_profiles WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    // 2. Nếu chưa có thì tạo mới hồ sơ rỗng
    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO company_profiles
        (user_id, company_name, logo_url, industry, company_size, website, description, address)
        VALUES ($1, '', '', '', '', '', '', '') RETURNING *`,
        [userId,]
      );

      return res.status(201).json(insertResult.rows[0]);
    }

    // 3. Nếu có rồi thì trả về
    return res.json(result.rows[0]);

  } catch (err) {
    console.error("GET /company/me error:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});


//Cập nhật thông tin công ty
router.put("/me", verifyToken, verifyRole("nhatuyendung","admin"), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company_name,
      logo_url,
      industry,
      company_size,
      website,
      description,
      address,
    } = req.body;

    // Kiểm tra xem user đã có hồ sơ chưa
    const existing = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length === 0) {
      // Nếu chưa có thì tạo mới
      const insert = await pool.query(
        `INSERT INTO company_profiles
        (user_id, company_name, logo_url, industry, company_size, website, description, address)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          userId,
          company_name,
          logo_url,
          industry,
          company_size,
          website,
          description,
          address,
        ]
      );
      return res.status(201).json(insert.rows[0]);
    } else {
      // Nếu đã có thì cập nhật
      const update = await pool.query(
        `UPDATE company_profiles SET
        company_name = $1,
        logo_url = $2,
        industry = $3,
        company_size = $4,
        website = $5,
        description = $6,
        address = $7,
        created_at = CURRENT_TIMESTAMP
        WHERE user_id = $8 RETURNING *`,
        [
          company_name,
          logo_url,
          industry,
          company_size,
          website,
          description,
          address,
          userId,
        ]
      );
      return res.json(update.rows[0]);
    }
  } catch (err) {
    console.error("PUT /company/me error:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

// Cấu hình lưu file logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads", "logo");
    fs.mkdirSync(dir, { recursive: true }); // tạo nếu chưa có
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// API upload avatar
router.post("/upload-logo", verifyToken, verifyRole("nhatuyendung"), upload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Không có ảnh được tải lên." });

  const userId = req.user.id;
  const logoUrl = `/uploads/logo/${req.file.filename}`; // URL để client truy cập

  try {
    await pool.query("UPDATE company_profiles SET logo_url = $1 WHERE user_id = $2", [logoUrl, userId]);
    res.json({ message: "Tải ảnh thành công!", logoUrl: logoUrl });
  } catch (err) {
    console.error("Lỗi khi cập nhật avatar:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật avatar." });
  }
});

module.exports = router;
