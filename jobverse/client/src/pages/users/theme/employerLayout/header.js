import { memo } from "react";
import { useEffect, useState } from "react";
import {axiosRecruiter} from "../../../../JWT/axiosClient";
import "./style.scss";
import { BiSolidHome } from "react-icons/bi";
import { BsVectorPen, BsFillBarChartLineFill, BsFillDoorOpenFill, BsFillPersonLinesFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import NotificationBell from "../../../../component/notificationBell";

const EmployeeHeader = ({user}) => {
  const navigate = useNavigate();

  // Nếu user chưa truyền vào thì lấy từ localStorage
  if (!user) {
    try {
      const stored = localStorage.getItem("user_nhatuyendung");
      user = stored ? JSON.parse(stored) : null;
    } catch (e) {
      user = null;
    }
  }

  //khi người dùng đăng xuất 
  const handleLogout = () => {
    // Xóa token và user khỏi localStorage
    localStorage.removeItem("token_nhatuyendung");
    localStorage.removeItem("user_nhatuyendung");

    // Điều hướng về trang chủ
    navigate("/");
  };

  const [company, setCompany] = useState(null);
  console.log(company);
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
          const res = await axiosRecruiter.get("/api/company/me");
          setCompany(res.data);
        } catch (err) {
          console.error("Lỗi khi lấy hồ sơ công ty:", err);
        }
    };
    fetchCompanyProfile();
  }, []);
  
  if (!company) return <div>Đang tải hồ sơ công ty...</div>;
  
  return (
    <header className="bg-gray-900 text-white py-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
        
        <div className="text-2xl font-bold text-teal-400 mb-3 md:mb-0">
          <Link to="/trang-nha-tuyen-dung">jobVerse</Link>
        </div>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BiSolidHome/>
            <Link to="/trang-nha-tuyen-dung">Trang chủ</Link>
          </li>
          {/* <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BiSearchAlt />
            <Link to="/trang-nha-tuyen-dung">Tìm ứng viên</Link>
          </li> */}
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsVectorPen />
            <Link to="/dang-tin-tuyen-dung">Đăng tin tuyển dụng</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillBarChartLineFill />
            <Link to={`/trang-cong-ty/${company.id}`}>Xem trang công ty</Link>
          </li>
        </ul>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium mt-3 md:mt-0">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <NotificationBell userId={user.id} token={user.token} />
          </li>
          
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillPersonLinesFill />
            <Link to="/ho-so-nha-tuyen-dung">Tài khoản</Link>
          </li>
          <li
            className="flex items-center space-x-1 text-white hover:text-teal-600 transition cursor-pointer"
            onClick={handleLogout}
          >
            <BsFillDoorOpenFill />
            <span>Đăng xuất</span>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default memo(EmployeeHeader);
