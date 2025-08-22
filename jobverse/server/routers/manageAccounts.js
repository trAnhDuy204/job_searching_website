const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const pool = require("../config/db");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

//Kiểm tra email và mật khẩu có đúng yêu cầu không
function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}
function isValidPassword(pw) {
  return typeof pw === "string" && pw.length >= 8; // tối thiểu 8 ký tự (bạn có thể thay rule)
}

// Update email (yêu cầu currentPassword)
router.put("/update-email", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { email, currentPassword } = req.body;

  if (!email || !currentPassword) {
    return res.status(400).json({ success: false, message: "Thiếu email hoặc mật khẩu hiện tại." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "Email không hợp lệ." });
  }

  try {
    // Lấy password_hash hiện tại
    const userRes = await pool.query("SELECT password_hash FROM users WHERE id = $1 LIMIT 1", [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
    }

    const hashed = userRes.rows[0].password_hash;
    // verify current password
    const valid = await argon2.verify(hashed, currentPassword);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng." });
    }

    // Cập nhật email
    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [email, userId]);
    return res.json({ success: true, message: "Email đã được thay đổi." });
  } catch (err) {
    console.error("update-email error:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

// Update password (yêu cầu currentPassword và newPassword)
router.put("/update-password", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới." });
  }
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ success: false, message: "Mật khẩu mới không hợp lệ (tối thiểu 8 ký tự)." });
  }

  try {
    // Lấy password_hash hiện tại
    const userRes = await pool.query("SELECT password_hash FROM users WHERE id = $1 LIMIT 1", [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
    }

    const hashed = userRes.rows[0].password_hash;
    // verify current password
    const valid = await argon2.verify(hashed, currentPassword);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng." });
    }

    // Hash mật khẩu mới bằng argon2
    const newHashed = await argon2.hash(newPassword);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHashed, userId]);

    return res.json({ success: true, message: "Mật khẩu đã được thay đổi." });
  } catch (err) {
    console.error("update-password error:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

module.exports = router;
