// HomeContent.jsx
import React from 'react';
import EmployeeJobList from '../../../../component/employeeProfile/employeeJobList';
import SearchBar from '../../../../component/searchBar';
const jobCategories = [
  { title: 'IT – Công nghệ', count: 4700 },
  { title: 'Admin / Hành chính', count: 260 },
  { title: 'Autocad / Thiết kế', count: 1000 },
];

const latestJobs = [
  { title: 'Nhân Viên IT Helpdesk', company: 'Công ty X', location: 'TP.HCM', salary: '10‑20 triệu' },
  // thêm các tin khác...
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
            <EmployeeJobList/>
        </section>

        {/* Việc làm mới nhất */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Việc làm mới nhất</h2>
          <div className="space-y-4">
            {latestJobs.map((job,i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                </div>
                <span className="text-teal-600 font-semibold">{job.salary}</span>
              </div>
            ))}
          </div>
        </section>
    </main>
  );
}
