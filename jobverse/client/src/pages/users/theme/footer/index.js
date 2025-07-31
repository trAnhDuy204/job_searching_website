import{ memo } from "react";
import { 
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./style.scss";
const Footer = () =>{
    return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="container_ve_chung_toi">
          <h1 className="text-3xl font-bold text-teal-400 mb-4">jobVerse</h1>
          <h4 className="text-lg font-semibold mb-2">Về chúng tôi</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>jobVerse.vn - Công Ty Cổ Phần jobVerse</li>
            <li>Phòng 202, Tòa nhà DP-35, Dragon Parc 2, Nguyễn Hữu Thọ, Nhà Bè, TP.HCM</li>
            <li>Điện thoại: (082) 3069 390</li>
            <li>Email ứng viên: tranhduydl@gmail.com</li>
            <li>Email nhà tuyển dụng: anhduy99204@gmail.com</li>
          </ul>
        </div>

        <div className="container_thong_tin">
          <h4 className="text-lg font-semibold mb-2">Thông tin</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><Link to="" className="hover:underline">Điều khoản sử dụng</Link></li>
            <li><Link to="" className="hover:underline">Quy định sử dụng</Link></li>
            <li><Link to="" className="hover:underline">Chính sách dữ liệu cá nhân</Link></li>
            <li><Link to="" className="hover:underline">Tuân thủ và sự đồng ý của khách hàng</Link></li>
          </ul>
        </div>

        <div className="container_ket_noi">
          <h4 className="text-lg font-semibold mb-2">Kết nối với chúng tôi</h4>
          <div className="flex space-x-4 mt-4">
            <Link to="https://www.facebook.com/Rinz99" target="_blank" rel="noreferrer" className="text-white hover:text-teal-400 text-2xl">
              <FaFacebook />
            </Link>
            <Link to="https://www.instagram.com/tr_duy9.9/" target="_blank" rel="noreferrer" className="text-white hover:text-teal-400 text-2xl">
              <FaInstagram />
            </Link>
            <Link to="https://www.tiktok.com/@trhaduy.04" target="_blank" rel="noreferrer" className="text-white hover:text-teal-400 text-2xl">
              <FaTiktok />
            </Link>
            <Link to="https://www.youtube.com/channel/UCrboJ6wjmDp8QpdS87VWxhw" target="_blank" rel="noreferrer" className="text-white hover:text-teal-400 text-2xl">
              <FaYoutube />
            </Link>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} jobVerse. All rights reserved.
      </div>
    </footer>
    );
}

export default memo(Footer);