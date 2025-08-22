const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const pool = require("../config/db");
require("dotenv").config();

//Kiểm tra email và mật khẩu có đúng yêu cầu không
function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}
function isValidPassword(pw) {
  return typeof pw === "string" && pw.length >= 8; // tối thiểu 8 ký tự (bạn có thể thay rule)
}

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "Email không hợp lệ." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ success: false, message: "Mật khẩu mới không hợp lệ (tối thiểu 8 ký tự)." });
  }

  try {
    // Kiểm tra username/email trùng
    const existing = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }

    // Hash mật khẩu
    const hashedPassword = await argon2.hash(password);

    // Thêm người dùng mới
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng theo email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    const user = userResult.rows[0];

    // Kiểm tra mật khẩu
    const isValidPassword = await argon2.verify(user.password_hash, password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    //Tạo JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' } // Token hết hạn sau 3 ngày
    );

    res.status(200).json({ message: 'Đăng nhập thành công',token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
