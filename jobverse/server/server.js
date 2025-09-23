require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cron = require("node-cron");
const pool = require("./config/db");


const authRoutes = require('./routers/auth');
const jobRoutes = require('./routers/jobPosts');
const categoryRoutes = require('./routers/categories');
const locationRoutes = require('./routers/locations');
const jobTypeRoutes = require('./routers/jobTypes');
const profileRoutes = require("./routers/profile");
const companyRoutes = require("./routers/company");
const manageJobPostsRoutes = require("./routers/manageJobPosts");
const manageApplicationsRoutes = require("./routers/manageApplications");
const applicationsRoutes = require("./routers/applications");
const accountRoutes = require("./routers/manageAccounts");
const savedJobsRoutes = require("./routers/saveJobs");
const messagesRoutes = require("./routers/messages");
const notificationsRoutes = require("./routers/notifications");
const adminRouters = require("./routers/admin");

//tạo server realtime
const io = new Server(server, {
  cors: {
    origin: "*", // hoặc chỉ định domain React
    methods: ["GET", "POST"]
  }
});
// Lắng nghe khi client kết nối
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Gắn userId để gửi notification riêng cho từng user
  socket.on("register", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Cho phép emit từ router
app.set("io", io);
app.use(cors({
  origin: "*", // hoặc chỉ định domain React
}));
app.use(express.json());

app.use("/", (req,res)=>{
  res.send("API is running...");
});


// Router xử lý các API auth
app.use('/api/auths', authRoutes);
// Routes xử lý các API jobPosts
app.use('/api/jobPosts', jobRoutes);
// Routes xử lý các API categories
app.use('/api', categoryRoutes);
// Routes xử lý các API locations
app.use('/api', locationRoutes);
// Routes xử lý các API jobTypes
app.use('/api', jobTypeRoutes);
//Routes xử lý các API profiles
app.use("/api/profile", profileRoutes);
//Routes xử lý các API company
app.use("/api/company", companyRoutes);
//Routes xử lý các API manageJobPosts
app.use("/api/employer", manageJobPostsRoutes);
//Routes xử lý các API manageApplications
app.use("/api", manageApplicationsRoutes);
//Routes xử lý các API applications
app.use("/api/applications", applicationsRoutes);
//Routes xử lý các API accounts
app.use("/api/account", accountRoutes);
//Routes xử lý các API saveJobs
app.use("/api/saved-jobs", savedJobsRoutes);
//Routes xử lý các API messages
app.use('/api/messages', messagesRoutes);
//Routes xử lý các API notifications
app.use('/api/notifications', notificationsRoutes);
//Routes xử lý các API admin
app.use('/api/admin', adminRouters);


//Routes xử lý các API uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cron job chạy mỗi ngày lúc 00:00
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await pool.query(
      `UPDATE job_posts 
       SET status = 'hết hạn'
       WHERE deadline < NOW() AND status != 'hết hạn'`
    );
    console.log(`Cron job: ${result.rowCount} job_posts đã được chuyển sang 'hết hạn'`);
  } catch (err) {
    console.error("Lỗi khi cập nhật job_posts hết hạn:", err);
  }
});

// Lắng nghe trên cổng 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
