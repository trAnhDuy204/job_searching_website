import React, { useEffect, useState } from "react";
import JobCard from "./jobCard";
import JobDetailModal from "./jobDetailModal";
import {axiosCandidate} from "../JWT/axiosClient";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await axiosCandidate.get(`/jobPosts?page=${page}&limit=12`);
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Lỗi tải jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleJobClick = (job) => {
    const token = localStorage.getItem("token_ungvien");
    if (!token) {
      alert("Vui lòng đăng nhập để xem chi tiết công việc.");
      return;
    }
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white">
          &lt;
        </button>
        <span className="font-medium text-teal-700">{page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white">
          &gt;
        </button>
      </div>

      {/* Hiện modal chi tiết nếu có */}
      {selectedJob && <JobDetailModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
};

export default JobList;
