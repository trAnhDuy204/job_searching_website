import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {axiosCandidate} from "../JWT/axiosClient";

const CompanyList = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosCandidate.get("/api/company/list"); 
        setCompanies(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách công ty:", err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {companies.map((company) => (
          <Link
            key={company.company_id}
            to={`/xem-trang-cong-ty/${company.company_id}`}
            className="flex flex-col items-center p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <img
              src={`${API_URL}${company.logo_url}` || `${API_URL}/uploads/default/logo_company_default.jpg`}
              alt={company.company_name}
              className="w-20 h-20 object-contain mb-3"
            />
            <span className="text-sm font-medium text-gray-800 text-center">
              {company.company_name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
