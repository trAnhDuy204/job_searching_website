import{ memo } from "react";
import { useParams } from "react-router-dom";
import CompanyPageLayout from "component/employerProfile/companyPageLayout";
const CompanyPage = () =>{
    const {id}=useParams();
    
    return (
        <CompanyPageLayout companyId={id} />
    );
}

export default memo(CompanyPage);