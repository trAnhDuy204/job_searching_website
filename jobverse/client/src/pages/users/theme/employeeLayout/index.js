import { memo } from "react";
import Footer from "../footer";
import EmployeeHearder from "./header";
import "./style.scss";
import { Outlet } from "react-router-dom";

const EmployeeLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <EmployeeHearder/>
            {/* Nếu có children thì ưu tiên hiển thị, nếu không thì render Outlet */}
            {children || <Outlet />}
            <Footer />
        </div>
    );
};

export default memo(EmployeeLayout);
