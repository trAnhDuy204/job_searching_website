import ReviewCompanyLayout from "component/employeeProfile/reviewCompanyLayout";
import{ memo } from "react";
import { useParams } from "react-router-dom";

const ReviewCompanyPage = () =>{
    const{id} =useParams();
    console.log(id);
    
    return (
        <ReviewCompanyLayout companyId={id}/>
    );
}

export default memo(ReviewCompanyPage);