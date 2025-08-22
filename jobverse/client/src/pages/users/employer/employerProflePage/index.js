import ProfileLayoutEmployer from "component/employerProfile/profileLayoutEmployer";
import{ memo } from "react";

const EmployerProfilePage = () =>{
    return (
        <div className="bg-gray-100 min-h-screen">
            <ProfileLayoutEmployer/>
        </div>
    );
}

export default memo(EmployerProfilePage);