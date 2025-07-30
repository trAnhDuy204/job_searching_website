import{ memo } from "react";
import "./style.scss";
import { BsPersonFill } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { BsVectorPen } from "react-icons/bs";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { Link } from "react-router-dom";
const Header = () =>{
    return (
        <div className="header_top">
            <div className="container">
                <div className="row">
                    <div className="col-6 header_top_left">
                        <ul>
                            <li>
                                <BiSearchAlt /><Link to={""}>Tìm việc làm</Link>
                            </li>
                            <li>
                                <BsVectorPen /><Link to={""}>Tạo CV</Link>
                            </li>
                            <li>
                                <BsFillBarChartLineFill /><Link to={""}>Phân tích mức lương</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-6 header_top_right">
                        <ul>
                            <li>
                                <BsPersonFill /><Link to="/dang-ky">Đăng ký</Link>
                            </li>
                            <li>
                                <BsPersonFill /><Link to="/dang-nhap">Đăng nhập</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Header);