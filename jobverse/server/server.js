const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/auth');
const jobRoutes = require('./routers/job');
const app = express();


app.use(cors());
app.use(express.json());

// Router xử lý các API auth
app.use('/api/auths', authRoutes);

// Routes xử lý các API job
app.use('/api/jobs', jobRoutes);

// Lắng nghe trên cổng 5000
app.listen(5000, () => {
  console.log('Server đang chạy tại http://localhost:5000');
});
