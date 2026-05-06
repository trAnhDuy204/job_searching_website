import React, { useEffect, useState } from "react";
import JobCard from "./jobCard";
import JobDetailModal from "./jobDetailModal";
import { axiosClient } from "../JWT/axiosClient";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  console.log(jobs);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/jobPosts?page=${page}&limit=12`);
      let jobs = res.data.jobs;

      // Nếu user đã login thì fetch saved jobs để merge is_saved
      const token = localStorage.getItem("token_ungvien");
      if (token) {
        try {
          const savedRes = await axiosClient.get("/api/saved-jobs/ids");
          const savedIds = new Set(savedRes.data.map((s) => s.job_post_id));
          jobs = jobs.map((job) => ({
            ...job,
            is_saved: savedIds.has(job.id),
          }));
        } catch {
          // Không fetch được saved jobs thì thôi, giữ nguyên
        }
      }

      setJobs(jobs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Lỗi tải jobs:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchJobs();
}, [page]);

  const handleJobClick = (job) => {
    const token =
      localStorage.getItem("token_ungvien") ||
      localStorage.getItem("token_nhatuyendung") ||
      localStorage.getItem("token_admin");
    if (!token) {
      alert("Vui lòng đăng nhập để xem chi tiết công việc.");
      return;
    }
    setSelectedJob(job);
  };

  const handleToggleSave = async (jobId) => {
    const token = localStorage.getItem("token_ungvien");
    if (!token) {
      alert("Vui lòng đăng nhập để lưu tin.");
      return;
    }
    try {
      const res = await axiosClient.post(`/api/saved-jobs/toggle`, { job_post_id: jobId });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, is_saved: res.data.saved } : job
        )
      );
    } catch (err) {
      console.error("Toggle save error:", err);
      alert("Không thể lưu/bỏ lưu tin. Vui lòng thử lại.");
    }
  };

  const closeModal = () => setSelectedJob(null);

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );

  const pageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Việc làm nổi bật
            </h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base ml-5">
            {loading ? "Đang tải..." : `Hiển thị trang ${page} / ${totalPages}`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-1">Không có việc làm</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Hiện chưa có tin tuyển dụng nào. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <JobCard
                  job={job}
                  saved={job.is_saved}
                  onClick={() => handleJobClick(job)}
                  onToggleSave={handleToggleSave}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${page === 1
                  ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 shadow-sm"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Trước</span>
            </button>

            {/* First page + ellipsis */}
            {pageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="w-9 h-9 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm"
                >
                  1
                </button>
                {pageNumbers()[0] > 2 && (
                  <span className="px-1 text-gray-400 text-sm">…</span>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200
                  ${p === page
                    ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-200 scale-105"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 shadow-sm"
                  }`}
              >
                {p}
              </button>
            ))}

            {/* Last page + ellipsis */}
            {pageNumbers()[pageNumbers().length - 1] < totalPages && (
              <>
                {pageNumbers()[pageNumbers().length - 1] < totalPages - 1 && (
                  <span className="px-1 text-gray-400 text-sm">…</span>
                )}
                <button
                  onClick={() => setPage(totalPages)}
                  className="w-9 h-9 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${page === totalPages
                  ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 shadow-sm"
                }`}
            >
              <span className="hidden sm:inline">Sau</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
};

export default JobList;