import React, { useEffect, useState, useCallback } from "react";
import { axiosRecruiter } from "../../JWT/axiosClient";
import EditJobModal from "./editJobModal";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJobData, setEditJobData] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token_nhatuyendung");
      const res = await axiosRecruiter.get("/employer/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Lỗi tải tin tuyển dụng:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tin này?")) return;
    try {
      const token = localStorage.getItem("token_nhatuyendung");
      await axiosRecruiter.delete(`/employer/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Lỗi xóa tin:", err);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 relative">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Tiêu đề</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Ngày đăng</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Ngày hết hạn</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job.id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                <td className="border px-4 py-3 text-left font-medium text-gray-700">{job.title}</td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">
                  {new Date(job.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString("vi-VN")
                    : "Không có"}
                </td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
                      job.status === "hoạt động"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : job.status ==="ẩn"
                        ? "bg-gray-100 text-gray-700 border-gray-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditJobData(job)}
                    className={`px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition`}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Không có tin tuyển dụng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editJobData && (
        <EditJobModal
          isOpen={!!editJobData}
          jobData={editJobData}
          onClose={() => setEditJobData(null)}
          onUpdated={fetchJobs}
        />
      )}
    </div>
  );
};

export default JobManagement;
