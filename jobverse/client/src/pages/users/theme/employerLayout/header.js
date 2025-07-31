import{ memo } from "react";
import "./style.scss";
import { BiSearchAlt } from "react-icons/bi";
import { BsVectorPen } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { Link } from "react-router-dom";
const EmployerHeader = () =>{
    return (
        <header className="bg-gray-900 text-white py-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
        
        <div className="text-2xl font-bold text-teal-400 mb-3 md:mb-0">
          <Link to="/trang-nha-tuyen-dung">jobVerse</Link>
        </div>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BiSearchAlt />
            <Link to="">Tìm ứng viên</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsVectorPen />
            <Link to="">Đăng tin tuyển dụng</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillBarChartLineFill />
            <Link to="">Xem trang công ty</Link>
          </li>
        </ul>

        <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 font-medium mt-3 md:mt-0">
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillPersonLinesFill />
            <Link to="/ho-so-nha-tuyen-dung">Tài khoản</Link>
          </li>
          <li className="flex items-center space-x-1 text-white hover:text-teal-600 transition">
            <BsFillDoorOpenFill />
            <Link to="/">Đăng xuất</Link>
          </li>
        </ul>
      </div>
    </header>
    );
}

export default memo(EmployerHeader);
