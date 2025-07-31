import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./jobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    const res = await axios.get(`http://localhost:5000/api/jobs?page=${page}&limit=12`);
    setJobs(res.data.jobs);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white">
          &lt;
        </button>
        <span className="font-medium text-teal-700">{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
          className="px-3 py-1 border rounded hover:bg-teal-500 hover:text-white">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default JobList;
