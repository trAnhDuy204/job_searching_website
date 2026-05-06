import { memo } from "react";
import Footer from "../footer";
import Header from "../header";
import { Outlet } from "react-router-dom";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-1 px-6 py-6">
                {children || <Outlet />}
            </div>

            <Footer />
        </div>
    );
};

export default memo(MasterLayout);
