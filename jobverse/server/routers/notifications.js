const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');


// Tạo notification mới
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id, message_id, type, content } = req.body;

    const result = await pool.query(
      `INSERT INTO notifications (user_id, message_id, type, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, message_id, type, content]
    );

    const notification = result.rows[0];

    // Emit real-time tới user_id
    const io = req.app.get("io");
    io.to(`user_${user_id}`).emit("new_notification", notification);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi tạo notification' });
  }
});

// Lấy tất cả notification của user
router.get('/:user_id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT n.*, m.subject 
       FROM notifications n
       LEFT JOIN messages m ON n.message_id = m.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [user_id]
    );

    const notification = result.rows[0];

    // Emit real-time tới user_id
    const io = req.app.get("io");
    io.to(`user_${user_id}`).emit("new_notification", notification);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy notifications' });
  }
});

// Đánh dấu notification đã đọc
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi cập nhật notification' });
  }
});

// Xoá notification theo id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM notifications WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Notification không tồn tại" });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xoá notification" });
  }
});

module.exports = router;
