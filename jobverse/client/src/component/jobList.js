import React, { useEffect, useState } from "react";
import JobCard from "./jobCard";
import JobDetailModal from "./jobDetailModal";
import { axiosCandidate } from "../JWT/axiosClient";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  console.log(jobs);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosCandidate.get(`/jobPosts?page=${page}&limit=12`);
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Lỗi tải jobs:", err);
      }
    };

    fetchJobs();
  }, [page]);

  const handleJobClick = (job) => {
    const token = localStorage.getItem("token_ungvien","token_nhatuyendung","token_admin");
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
      const res = await axiosCandidate.post(`/saved-jobs/toggle`, { job_post_id: jobId });
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

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            saved={job.is_saved} // để JobCard hiển thị icon lưu
            onClick={() => handleJobClick(job)}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white"
        >
          &lt;
        </button>
        <span className="font-medium text-teal-700">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white"
        >
          &gt;
        </button>
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
};

export default JobList;
