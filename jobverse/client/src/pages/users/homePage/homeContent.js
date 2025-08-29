// HomeContent.jsx
import React from 'react';
import JobList from '../../../component/jobList';
import SearchBar from '../../../component/searchBar';
import "./style.scss";
import CompanyList from 'component/compantList';
const jobCategories = [
  { title: 'IT – Công nghệ', count: 4700 },
  { title: 'Admin / Hành chính', count: 260 },
  { title: 'Autocad / Thiết kế', count: 1000 },
];


export default function HomeContent() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Banner tìm việc */}
        <section className="bg-blue-600 text-white rounded-lg p-8 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tìm việc làm nhanh chóng</h1>
            <p className="text-lg">Cập nhật hàng ngàn việc làm mỗi ngày</p>
          </div>
          <div className="max-w-5xl mx-auto mt-10">
            <SearchBar/>
          </div>
        </section>

        {/* Gợi ý ngành nghề */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Ngành nghề nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {jobCategories.map(cat => (
              <div key={cat.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
                <h3 className="text-xl font-bold">{cat.title}</h3>
                <p className="text-teal-600">{cat.count}+ việc làm</p>
              </div>
            ))}
          </div>
        </section>

        <section>
            <h2 className="text-2xl font-semibold mb-4">Danh sách tin tuyển dụng</h2>
            <JobList/>
        </section>

        {/* Việc làm mới nhất */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Danh sách công ty</h2>
          <CompanyList/>
        </section>
    </main>
  );
}
