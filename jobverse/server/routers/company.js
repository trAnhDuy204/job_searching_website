const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken , verifyRole} = require("../middleware/authMiddleware");

// Lấy thông tin công ty
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra xem đã có hồ sơ chưa
    let result = await pool.query(
      "SELECT * FROM company_profiles WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    // Nếu chưa có thì tạo mới hồ sơ rỗng
    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO company_profiles
        (user_id, company_name, logo_url, industry, company_size, website, description, address)
        VALUES ($1, '', '/uploads/default/logo_company_default.jpg', '', '', '', '', '') RETURNING *`,
        [userId,]
      );

      return res.status(201).json(insertResult.rows[0]);
    }

    // Nếu có rồi thì trả về
    return res.json(result.rows[0]);

  } catch (err) {
    console.error("GET /company/me error:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});


// Cập nhật thông tin công ty
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

// hàm xóa file rác
function deleteFile(filePath) {
  // Đường dẫn tuyệt đối tới file default
  const defaultLogoPath = path.join(__dirname, "..", "uploads", "default", "logo_company_default.jpg");

  // Nếu file cần xóa trùng với file default thì bỏ qua
  if (path.resolve(filePath) === path.resolve(defaultLogoPath)) {
    console.log("Bỏ qua không xóa file mặc định:", filePath);
    return;
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Lỗi khi xóa file:", err);
    } else {
      console.log("Đã xóa file:", filePath);
    }
  });
}

const upload = multer({ storage });

// API upload logo
router.post("/upload-logo", verifyToken, verifyRole("nhatuyendung"), upload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Không có ảnh được tải lên." });

  const userId = req.user.id;
  const logoUrl = `/uploads/logo/${req.file.filename}`;

  try {
    // Lấy logo_url cũ
    const result = await pool.query("SELECT logo_url FROM company_profiles WHERE user_id = $1", [userId]);

    if (result.rows.length > 0) {
      const oldLogoUrl = result.rows[0].logo_url;
      if (oldLogoUrl) {
        // Đường dẫn file cũ trên ổ đĩa
        const oldFilePath = path.join(__dirname, "..", oldLogoUrl);
        // Kiểm tra file có tồn tại rồi mới xóa
        if (fs.existsSync(oldFilePath)) {
          deleteFile(oldFilePath);
        }
      }
    }

    // Cập nhật logo mới
    await pool.query("UPDATE company_profiles SET logo_url = $1 WHERE user_id = $2", [logoUrl, userId]);

    res.json({ message: "Tải ảnh thành công!", logoUrl: logoUrl });
  } catch (err) {
    console.error("Lỗi khi cập nhật logo:", err);
    // Xóa file mới upload nếu lỗi xảy ra
    deleteFile(req.file.path);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật logo." });
  }
});

module.exports = router;
