import{ memo } from "react";
import HomeContent from "./homeContent";
const EmployeeHomePage = () =>{
    return (
        <div className="bg-gray-100 min-h-screen">
            <HomeContent />
        </div>
    );
}

export default memo(EmployeeHomePage);