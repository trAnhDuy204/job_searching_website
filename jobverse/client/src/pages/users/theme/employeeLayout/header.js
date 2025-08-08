import { memo } from "react";
import "./style.scss";
import { BiSearchAlt } from "react-icons/bi";
import { BsVectorPen, BsFillBarChartLineFill, BsFillDoorOpenFill, BsFillPersonLinesFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';

const EmployeeHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và user khỏi localStorage
    localStorage.removeItem("token_ungvien");
    localStorage.removeItem("user_ungvien");

    // Điều hướng về trang chủ
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-white py-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
        
        <div className="text-2xl font-bold text-teal-400 mb-3 md:mb-0">
          <Link to="/trang-ung-vien">jobVerse</Link>
        </div>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BiSearchAlt />
            <Link to="">Tìm việc làm</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsVectorPen />
            <Link to="">Tạo CV</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillBarChartLineFill />
            <Link to="">Phân tích mức lương</Link>
          </li>
        </ul>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium mt-3 md:mt-0">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillPersonLinesFill />
            <Link to="/ho-so-ung-vien">Tài khoản</Link>
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
