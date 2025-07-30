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
    return <footer className="footer">
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <div className="footer_about">
                        <h1 className="footer_about_logo">jobVerse</h1>
                        <h4>Về chúng tôi</h4>
                        <ul>
                            <li>jobVerse.vn - Công Ty Cổ Phần jobVerse</li>
                            <li>Phòng 202, Tòa nhà dp-35, Dragon Parc 2, Nguyễn Hữu Thọ, Nhà Bè, Thành phố Hồ Chí Minh</li>
                            <li>Điện thoại: (082) 3069 390</li>
                            <li>Email hỗ trợ người tìm việc: tranhduydl@gmail.com</li>
                            <li>Email hỗ trợ nhà tuyển dụng: anhduy99204@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="footer_info">
                        <h4>Thông tin</h4>
                        <ul>
                            <li>
                                <Link to ={""}>Điều khoản sử dụng</Link>
                            </li>
                            <li>
                                <Link to ={""}>Quy đinh sử dụng</Link>
                            </li>
                            <li>
                                <Link to ={""}>Chính sách dữ liệu cá nhân</Link>
                            </li>
                            <li>
                                <Link to ={""}>Tuân thủ và sự đồng ý của khách hàng</Link>
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <div className="col-lg-3">
                    <div className="footer_connect">
                        <h4>Kết nối với chúng tôi</h4>
                        <div className="footer_connect_social">
                            <div>
                                <Link to="https://www.facebook.com/Rinz99"><FaFacebook /></Link>
                            </div>
                            <div>
                                <Link to="https://www.instagram.com/tr_duy9.9/"><FaInstagram /></Link>
                            </div>
                            <div>
                                <Link to="https://www.tiktok.com/@trhaduy.04"><FaTiktok/></Link>
                            </div>
                            <div>
                                <Link to="https://www.youtube.com/channel/UCrboJ6wjmDp8QpdS87VWxhw"><FaYoutube/></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    ;
}

export default memo(Footer);