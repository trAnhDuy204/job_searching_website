import ProfileLayout from "component/employeeProfile/profileLayout";
import{ memo } from "react";

const EmployeeProfilePage = () =>{
    return (
        <div className="bg-gray-100 min-h-screen">
            <ProfileLayout/>
        </div>
    );
}

export default memo(EmployeeProfilePage);

