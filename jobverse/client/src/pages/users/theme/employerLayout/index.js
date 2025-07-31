import { memo } from "react";
import Footer from "../footer";
import EmployerHearder from "./header";
import { Outlet } from "react-router-dom";

const EmployerLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <EmployerHearder/>
            {/* Nếu có children thì ưu tiên hiển thị, nếu không thì render Outlet */}
            {children || <Outlet />}
            <Footer />
        </div>
    );
};

export default memo(EmployerLayout);
