import React from 'react';
import SearchBar from '../../../../component/searchBar';
import CompanyList from 'component/compantList';
import "./style.scss";
import JobList from '../../../../component/jobList';
import { Link } from "react-router-dom";

const jobCategories = [
  { title: 'IT – Công nghệ', count: 4700, icon: '💻', color: 'from-blue-500 to-cyan-400' },
  { title: 'Admin / Hành chính', count: 260, icon: '🗂️', color: 'from-violet-500 to-purple-400' },
  { title: 'Autocad / Thiết kế', count: 1000, icon: '✏️', color: 'from-orange-500 to-amber-400' },
];

const stats = [
  { label: 'Việc làm đăng tuyển', value: '12,000+' },
  { label: 'Nhà tuyển dụng', value: '3,500+' },
  { label: 'Ứng viên thành công', value: '98,000+' },
];

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ====== HERO BANNER ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-teal-200 px-4">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <span className="inline-block bg-white/20 text-teal-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
              Nền tảng tuyển dụng hàng đầu
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Tìm việc làm{' '}
              <span className="text-teal-500">nhanh chóng</span>
            </h1>
            <p className="text-teal-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Cập nhật hàng ngàn việc làm mỗi ngày — kết nối bạn với nhà tuyển dụng hàng đầu.
            </p>

            <div className="max-w-5xl mx-auto">
              <SearchBar />
            </div>

            {/* Quick stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-16">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-teal-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg viewBox="0 0 1440 60" className="w-full block" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f9fafb" />
        </svg>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ====== NGÀNH NGHỀ NỔI BẬT ====== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Ngành nghề nổi bật</h2>
              <p className="text-gray-500 mt-1 text-sm">Khám phá cơ hội việc làm theo lĩnh vực</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {jobCategories.map((cat) => (
              <div
                key={cat.title}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="p-6 flex items-center gap-5">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{cat.title}</h3>
                    <p className="text-teal-600 font-semibold text-sm mt-0.5">{cat.count.toLocaleString()}+ việc làm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/trang-chu-tim-viec" className="sm:hidden mt-4 flex items-center justify-center gap-1 text-blue-600 font-medium text-sm">
            Xem tất cả ngành nghề →
          </Link>
        </section>

        {/* ====== DANH SÁCH TIN TUYỂN DỤNG ====== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Tin tuyển dụng mới nhất</h2>
              <p className="text-gray-500 mt-1 text-sm">Cập nhật liên tục mỗi ngày</p>
            </div>
          </div>
          <JobList />
        </section>

        {/* ====== DANH SÁCH CÔNG TY ====== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Nhà tuyển dụng nổi bật</h2>
              <p className="text-gray-500 mt-1 text-sm">Các công ty hàng đầu đang tìm kiếm ứng viên</p>
            </div>
          </div>
          <CompanyList />
        </section>

      </div>

      {/* ====== CTA FOOTER BANNER ====== */}
      <section className="bg-gradient-to-r from-blue-100 to-teal-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Bạn là nhà tuyển dụng?
          </h2>
          <p className="text-teal-500 text-lg mb-8">
            Đăng tin tuyển dụng miễn phí, tiếp cận hàng triệu ứng viên tiềm năng.
          </p>
          <Link 
            to="/dang-ky"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg text-base"
          >
            Đăng tin ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
