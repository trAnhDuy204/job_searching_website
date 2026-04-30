# Cài đặt và chạy trên máy local

## 1. Cài đặt Backend (Server)

### Di chuyển vào thư mục `server`

```bash
cd "server"
```
### 🧩 Cài đặt package

```bash
yarn install
# hoặc
npm install
```
### Cài đặt cấu hình yêu cầu

```bash
yarn add server_requirements.txt
```

### Cấu hình .env

```env
PORT=5000
DATABASE_URL=postgresql://postgres:abc123@localhost:5432/db_web_tim_kiem_viec_lam
JWT_SECRET=your_jwt_secret_key
```
### Khởi chạy server

```bash
node server.js
```
Mặc định chạy tại: http://localhost:5000

## 2. Cài đặt Frontend (Client)

### Di chuyển vào thư mục client

```bash
cd "client"
```
###  Cài đặt cấu hình yêu cầu

```bash
yarn add client_requirements.txt
```

### Khởi chạy client

```bash
yarn start
# hoặc
npm start
```
Giao diện chạy tại: http://localhost:3000

## 3. Kiểm thử hiệu năng

Dự án đi kèm file TestPerformance.jmx để bạn kiểm thử hiệu năng bằng Apache JMeter.

## 4. Một số tài khoản mẫu để đăng nhập

### Ứng viên

Email: user01@gmail.com

Mật khẩu: 123

### Nhà tuyển dụng

Email: ntd02@gmail.com

Mật khẩu: 123

### Quản trị viên
Email: admin01@gmail.com
Mật khẩu: 12345678
