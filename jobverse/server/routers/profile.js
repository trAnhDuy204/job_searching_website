const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken, verifyRole} = require("../middleware/authMiddleware");

// Lấy dữ liệu hồ sơ cá nhân
router.get("/me", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.username,
        u.email,
        p.full_name,
        p.gender,
        p.dob,
        p.phone,
        p.address,
        p.avatar_url,
        p.description
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hồ sơ người dùng." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi khi lấy hồ sơ:", err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
});

// Cập nhật lại hô sơ cá nhân
router.put("/me", verifyToken, verifyRole("ungvien","admin"), async (req, res) => {
  const userId = req.user.id;
  const { full_name, gender, dob, phone, address, description } = req.body;

  try {
    // Kiểm tra đã có hồ sơ chưa
    const check = await pool.query("SELECT 1 FROM profiles WHERE user_id = $1", [userId]);

    if (check.rowCount > 0) {
      // Nếu đã có thì cập nhật
      await pool.query(
        `
        UPDATE profiles SET 
          full_name = $1,
          gender = $2,
          dob = $3,
          phone = $4,
          address = $5,
          description = $6
        WHERE user_id = $7
        `,
        [full_name, gender, dob, phone, address, description, userId]
      );
    } else {
      // Nếu chưa có thì thêm mới
      await pool.query(
        `
        INSERT INTO profiles (user_id, full_name, gender, dob, phone, address, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [userId, full_name, gender, dob, phone, address, description]
      );
    }

    res.json({ message: "Cập nhật hồ sơ thành công!" });
  } catch (err) {
    console.error("Lỗi khi cập nhật hồ sơ:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật hồ sơ." });
  }
});

// Cấu hình lưu file avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads", "avatars");
    fs.mkdirSync(dir, { recursive: true }); // tạo nếu chưa có
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// API upload avatar
router.post("/upload-avatar", verifyToken, verifyRole("ungvien"), upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Không có ảnh được tải lên." });

  const userId = req.user.id;
  const avatarUrl = `/uploads/avatars/${req.file.filename}`; // URL để client truy cập

  try {
    await pool.query("UPDATE profiles SET avatar_url = $1 WHERE user_id = $2", [avatarUrl, userId]);
    res.json({ message: "Tải ảnh thành công!", avatar_url: avatarUrl });
  } catch (err) {
    console.error("Lỗi khi cập nhật avatar:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật avatar." });
  }
});


module.exports = router;
