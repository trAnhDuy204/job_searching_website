import { memo } from "react";
import Footer from "../footer";
import AdminHeader from "./header";
import "./style.scss";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <AdminHeader/>
            {/* Nếu có children thì ưu tiên hiển thị, nếu không thì render Outlet */}
            {children || <Outlet />}
            <Footer />
        </div>
    );
};

export default memo(AdminLayout);
