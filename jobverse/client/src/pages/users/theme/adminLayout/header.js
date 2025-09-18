import { memo } from "react";
import "./style.scss";
import {  BsFillDoorOpenFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';

const AdminHeader = ({ user }) => {
  const navigate = useNavigate();

  // Nếu user chưa truyền vào thì lấy từ localStorage
  if (!user) {
    try {
      const stored = localStorage.getItem("user_admin");
      user = stored ? JSON.parse(stored) : null;
    } catch (e) {
      user = null;
    }
  }

  const handleLogout = () => {
    // Xóa token và user khỏi localStorage
    localStorage.removeItem("token_admin");
    localStorage.removeItem("user_admin");

    // Điều hướng về trang chủ
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-white py-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
        
        <div className="text-2xl font-bold text-teal-400 mb-3 md:mb-0">
          <Link to="/trang-quan-tri-vien">jobVerse</Link>
        </div>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium mt-3 md:mt-0">
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

export default memo(AdminHeader);
