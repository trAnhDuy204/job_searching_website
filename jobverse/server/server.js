const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Gắn router xử lý các API auth
app.use('/api', authRoutes);

// Lắng nghe trên cổng 5000
app.listen(5000, () => {
  console.log('Server đang chạy tại http://localhost:5000');
});
