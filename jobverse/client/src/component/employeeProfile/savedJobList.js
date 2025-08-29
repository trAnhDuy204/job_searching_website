import React, { useEffect, useState } from "react";
import { axiosCandidate } from "../../JWT/axiosClient";
import JobDetailModal from "../jobDetailModal";

const SavedJobsList = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axiosCandidate.get("/saved-jobs/list");
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Lỗi tải tin đã lưu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleToggleSave = async (jobId) => {
    try {
      const res = await axiosCandidate.post("/saved-jobs/toggle", {
        job_post_id: jobId,
      });
      if (!res.data.saved) {
        setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
        // Nếu đang mở modal của job bị bỏ lưu thì đóng modal
        if (selectedJob?.id === jobId) {
          setSelectedJob(null);
        }
      }
    } catch (err) {
      console.error("Không thể bỏ lưu tin:", err);
    }
  };

  const handleViewDetail = (jobId) => {
    const job = savedJobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Đang tải...</p>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 relative">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3 text-left font-medium text-gray-700">Tiêu đề</th>
              <th className="border px-4 py-3 text-left font-medium text-gray-700">Công ty</th>
              <th className="border px-4 py-3 text-left font-medium text-gray-700">Địa chỉ</th>
              <th className="border px-4 py-3 text-left font-medium text-gray-700">Hạn nộp</th>
              <th className="border px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
              <th className="border px-4 py-3 text-center font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border px-4 py-3 text-gray-800 font-medium">{job.title}</td>
                  <td className="border px-4 py-3 text-gray-600">{job.company_name}</td>
                  <td className="border px-4 py-3 text-gray-600">{job.location || "—"}</td>
                  <td className="border px-4 py-3 text-gray-600">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="border px-4 py-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
                        job.status === "hoạt động"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : job.status === "ẩn"
                          ? "bg-gray-100 text-gray-700 border-gray-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetail(job.id)}
                      className={`px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition ${
                        job.status !== "hoạt động"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      Xem
                    </button>
                    <button
                      className= "px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      onClick={() => handleToggleSave(job.id)}
                    >
                      Bỏ lưu
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  Bạn chưa lưu tin nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết công việc */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>

  );
};

export default SavedJobsList;
