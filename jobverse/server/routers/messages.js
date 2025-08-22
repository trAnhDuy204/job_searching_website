const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');


// Gửi message mới
router.post('/',verifyToken, async (req, res) => {
  try {
    const { sender_id, receiver_id, subject, content } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sender_id, receiver_id, subject, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi gửi message' });
  }
});

// Lấy tất cả messages của user (inbox)
router.get('/inbox/:user_id', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM messages WHERE receiver_id = $1 ORDER BY sent_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy inbox' });
  }
});

// Lấy chi tiết message
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM messages WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy message' });

    // update is_read = true khi mở
    await pool.query(`UPDATE messages SET is_read = TRUE WHERE id = $1`, [id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy message' });
  }
});

module.exports = router;
