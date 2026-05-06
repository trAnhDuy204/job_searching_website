import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../JWT/axiosClient";

const CompanyList = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosClient.get("/api/company/list");
        setCompanies(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách công ty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const SkeletonCard = () => (
    <div className="flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-3" />
      <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-1.5" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-teal-500 to-emerald-400" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight leading-tight">
              Nhà tuyển dụng nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Khám phá các công ty hàng đầu đang tuyển dụng
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Chưa có công ty nào</p>
          <p className="text-gray-400 text-sm mt-1">Vui lòng quay lại sau</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {companies.map((company, index) => (
            <Link
              key={company.company_id}
              to={`/xem-trang-cong-ty/${company.company_id}`}
              className="group flex flex-col items-center p-4 sm:p-5 bg-white rounded-2xl border border-gray-100
                         shadow-sm hover:shadow-md hover:border-teal-200 hover:-translate-y-1
                         transition-all duration-250"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Logo wrapper */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-xl overflow-hidden
                              ring-1 ring-gray-100 group-hover:ring-teal-200 transition-all duration-250 bg-gray-50 flex items-center justify-center">
                <img
                  src={company.logo_url || `${API_URL}/uploads/default/logo_company_default.jpg`}
                  alt={company.company_name}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-250"
                  onError={(e) => {
                    e.target.src = `${API_URL}/uploads/default/logo_company_default.jpg`;
                  }}
                />
              </div>

              {/* Company name */}
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-snug
                               group-hover:text-teal-700 transition-colors duration-200 line-clamp-2">
                {company.company_name}
              </span>

              {/* Subtle "Xem thêm" indicator on hover */}
              <span className="mt-1.5 text-[10px] text-teal-500 font-medium opacity-0 group-hover:opacity-100
                               transition-opacity duration-200 flex items-center gap-0.5">
                Xem chi tiết
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CompanyList;