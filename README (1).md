# Hệ thống tìm việc làm trực tuyến

## Giới thiệu

Đề tài xây dựng một hệ thống website hỗ trợ **tìm kiếm việc làm** và
**đăng tin tuyển dụng**, đóng vai trò cầu nối giữa **nhà tuyển dụng** và
**người tìm việc**.\
Hệ thống được phát triển dựa trên mô hình **ASP.NET MVC (.NET
Framework)**, sử dụng **SQL Server** làm cơ sở dữ liệu, tích hợp các
công nghệ hiện đại nhằm mang lại trải nghiệm thuận tiện, trực quan và
bảo mật.

## Công nghệ sử dụng

-   **ASP.NET MVC (.NET Framework)**: kiến trúc Model -- View --
    Controller, tách biệt các tầng của ứng dụng.\
-   **SQL Server**: quản lý và lưu trữ dữ liệu.\
-   **Entity Framework**: ORM hỗ trợ thao tác dữ liệu dưới dạng đối
    tượng.\
-   **Bootstrap**: xây dựng giao diện responsive, thân thiện với thiết
    bị di động.\
-   **TinyMCE**: trình soạn thảo văn bản trực tuyến để mô tả công việc.\
-   **Cookie Authentication**: cơ chế xác thực người dùng và phân quyền.

## Chức năng chính

### Người tìm việc

-   Đăng ký, đăng nhập, chỉnh sửa hồ sơ cá nhân.\
-   Tìm kiếm việc làm, lưu tin, nộp hồ sơ ứng tuyển.\
-   Tạo CV trực tuyến.

### Nhà tuyển dụng

-   Quản lý thông tin công ty.\
-   Đăng tin tuyển dụng với mô tả chi tiết.\
-   Quản lý hồ sơ ứng tuyển, chấp nhận hoặc từ chối ứng viên.

### Quản trị viên

-   Quản lý tài khoản người dùng.\
-   Quản lý tin tuyển dụng, kiểm duyệt nội dung.

## Cấu trúc hệ thống

-   **Model**: quản lý dữ liệu (Users, Jobs, Applications,
    Companies...).\
-   **View**: giao diện hiển thị sử dụng Razor + Bootstrap.\
-   **Controller**: xử lý logic, điều hướng dữ liệu giữa Model và View.

## Hướng dẫn cài đặt

1.  Clone dự án về máy:

    ``` bash
    git clone <repository_url>
    ```

2.  Mở dự án bằng **Visual Studio**.\

3.  Cấu hình kết nối **SQL Server** trong `appsettings.json` hoặc
    `Web.config`.\

4.  Thực hiện **Migration** với Entity Framework để khởi tạo cơ sở dữ
    liệu.\

5.  Chạy dự án (IIS Express hoặc cấu hình host riêng).

## Phát triển trong tương lai

-   Tích hợp AI để gợi ý việc làm phù hợp.\
-   Thêm tính năng chat trực tuyến.\
-   Hỗ trợ đa ngôn ngữ.\
-   Tích hợp xác thực hai lớp (2FA).

## Tác giả

-   **Trần Hà Anh Duy** -- Sinh viên ngành Khoa học máy tính.\
-   Giảng viên hướng dẫn: **ThS. Nguyễn Văn Bảy**.
