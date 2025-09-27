const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken , verifyRole} = require("../middleware/authMiddleware");
// Cloudinary
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lấy thông tin công ty để tạo hồ sơ
router.get("/me",verifyToken, async (req, res) => {
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
        VALUES ($1, '', '${API_URL}/uploads/default/logo_company_default.jpg', '', '', '', '', '') RETURNING *`,
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

// Lấy danh sách công ty
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id as company_id, company_name, logo_url FROM company_profiles ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy danh sách công ty:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Lấy thông tin công ty để tạo trang
router.get("/:company_id", async (req, res) => {
  try {
    const { company_id } = req.params;

    if (!company_id || isNaN(company_id)) {
      return res.status(400).json({ error: "company_id không hợp lệ" });
    }

    const result = await pool.query(
      `SELECT id, company_name, description, company_size, industry, address, website, logo_url, created_at
       FROM company_profiles 
       WHERE id = $1`,
      [company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy công ty" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi lấy thông tin công ty:", err);
    res.status(500).json({ error: "Lỗi server" });
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

// Storage cho logo
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "company_logos",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `logo-${req.user.id}-${Date.now()}`,
  },
});

const upload = multer({ storage });

// API upload logo
router.post("/upload-logo", verifyToken, verifyRole("nhatuyendung"), upload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Không có ảnh được tải lên." });

  const userId = req.user.id;
  const logoUrl = req.file.path;

  try {
    // Lấy logo_url cũ từ DB
    const result = await pool.query("SELECT logo_url FROM company_profiles WHERE user_id = $1", [userId]);

    if (result.rows.length > 0) {
      const oldLogoUrl = result.rows[0].logo_url;

      // Nếu logo cũ không phải default thì xóa khỏi Cloudinary
      if (oldLogoUrl && !oldLogoUrl.includes("logo_company_default.jpg")) {
        const parts = oldLogoUrl.split("/");
        const publicId = parts.slice(-2).join("/").split(".")[0]; // lấy folder/filename
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Không thể xóa logo cũ trên Cloudinary:", err);
        }
      }
    }

    // Cập nhật logo mới vào DB
    await pool.query("UPDATE company_profiles SET logo_url = $1 WHERE user_id = $2", [logoUrl, userId]);

    res.json({ message: "Tải logo thành công!", logoUrl });
  } catch (err) {
    console.error("Lỗi khi cập nhật logo:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi cập nhật logo." });
  }
});

module.exports = router;
