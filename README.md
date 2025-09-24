# 🧑‍💼 Website Đăng Tin Tuyển Dụng và Tìm Kiếm Việc Làm
# Deployment: https://tranhduy204.github.io/job_searching_website
# xem chi tiết báo cáo tại https://drive.google.com/file/d/1Fe_jkGPTdk1dQ1bI1NXR_n9kob_5Bzab/view?usp=drive_link
## 📝 Giới thiệu
Đây là đồ án tốt nghiệp ngành Khoa học máy tính, được phát triển nhằm xây dựng một nền tảng tuyển dụng trực tuyến có tính năng **thân thiện với người dùng**, **hiệu quả về mặt hiệu năng**, và **mở rộng dễ dàng trong tương lai**.

Website hỗ trợ ba loại tài khoản:
- **Ứng viên:** Tìm việc, nộp đơn, tạo CV, theo dõi thông báo và phân tích mức lương.
- **Nhà tuyển dụng:** Đăng tin, quản lý đơn ứng tuyển, xây dựng hồ sơ công ty.
- **Quản trị viên:** Quản lý người dùng, tin tuyển dụng, danh mục và hệ thống.

## 🛠️ Công nghệ sử dụng

| Layer         | Công nghệ                                  |
|---------------|---------------------------------------------|
| Frontend      | ReactJS (SPA, kiến trúc MVVM)              |
| Backend       | Flask (Python), Node.js + Express (REST API) |
| Database      | PostgreSQL                                 |
| Kiến trúc     | Client-Server hướng **Microservices**       |
| Bảo mật       | Argon2 (hash mật khẩu), JWT (xác thực)     |
| Phân tích dữ liệu | Pandas + Flask API (trực quan hoá mức lương)  |

## 🔑 Chức năng chính

### 📌 1. Ứng viên
- Đăng ký / Đăng nhập
- Tìm kiếm việc làm, lọc theo ngành, vị trí, mức lương
- Nộp đơn ứng tuyển + gửi tin nhắn cho nhà tuyển dụng
- Tạo CV trực tuyến
- Lưu tin tuyển dụng, theo dõi trạng thái đơn ứng tuyển
- Xem phân tích mức lương trung bình theo ngành (dữ liệu tiền sử lý: https://drive.google.com/file/d/1aOtlv8rOT_VKtgQTetG6POR98y-Xnpkc/view?usp=drive_link)

### 📌 2. Nhà tuyển dụng
- Tạo và quản lý hồ sơ công ty
- Đăng, chỉnh sửa và xoá tin tuyển dụng
- Duyệt, từ chối và phản hồi hồ sơ ứng viên
- Gửi tin nhắn thông báo phỏng vấn

### 📌 3. Quản trị viên
- Quản lý người dùng
- Quản lý công ty, tin tuyển dụng
- Kiểm duyệt nội dung và danh mục

## 📊 Kiểm thử hiệu năng

- Sử dụng **Apache JMeter**
- Thực hiện **Load Testing và Stress Testing** cho từng loại tài khoản
- Tải lên đến **1000 users**, đo lường: `response time`, `throughput`, `error rate`
- Kết luận:
  - Ổn định tốt nhất ở mức **200 user đồng thời**
  - Từ 500 user trở lên bắt đầu nghẽn cổ chai
  - Cần tối ưu/tăng cường hạ tầng để mở rộng

## 📌 Hướng phát triển tương lai
- Tích hợp AI để gợi ý công việc hoặc ứng viên phù hợp
- Hệ thống đánh giá nhà tuyển dụng và ứng viên
- Phân tích xu hướng thị trường lao động
- Tăng cường bảo mật, mã hoá tin nhắn và dữ liệu người dùng
## 🧪 Một số tài khoản mẫu để đăng nhập

✅ Ứng viên

Email: user01@gmail.com

Mật khẩu: 123

✅ Nhà tuyển dụng

Email: ntd02@gmail.com

Mật khẩu: 123

✅ Quản trị viên
Email: admin01@gmail.com
Mật khẩu: 12345678

## 👨‍🎓 Thông tin sinh viên

- **Họ tên:** Trần Hà Anh Duy  
- **MSSV:** 2251012051  
- **Trường:** Đại học Mở TP.HCM  
- **Ngành:** Khoa học máy tính  
- **GVHD:** ThS. Nguyễn Văn Bảy  

## 📄 Giấy phép

Dự án phục vụ mục đích học tập – phi thương mại. Mọi hành vi sao chép thương mại không được phép nếu chưa được sự đồng ý từ tác giả.
