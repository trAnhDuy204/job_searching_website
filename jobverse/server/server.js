require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");


const authRoutes = require('./routers/auth');
const jobRoutes = require('./routers/jobPosts');
const categoryRoutes = require('./routers/categories');
const locationRoutes = require('./routers/locations');
const jobTypeRoutes = require('./routers/jobTypes');
const profileRoutes = require("./routers/profile");
const companyRoutes = require("./routers/company");


app.use(cors());
app.use(express.json());

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


//Routes xử lý các API uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Lắng nghe trên cổng 5000
app.listen(5000, () => {
  console.log('Server đang chạy tại http://localhost:5000');
});
