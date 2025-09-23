import { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";
import JobDetailModalAdmin from "../../component/admin/JobDetailModalAdmin";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    const res = await axiosAdmin.get("/api/admin/job-posts");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const updateStatus = async () => {
    await axiosAdmin.put(`/api/admin/job-posts/status`);
    fetchJobs();
  };

  const deleteJob = async (id) => {
    if (window.confirm("Xóa tin tuyển dụng này?")) {
      await axiosAdmin.delete(`/api/admin/job-posts/${id}`);
      fetchJobs();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Danh sách Tin tuyển dụng</h2>
      <button
            onClick={() => updateStatus}
            className="px-2  py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
            Cập nhật trang thái tin
        </button>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Công ty</th>
            <th className="border p-2">Hạn nộp đơn</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td className="border p-2">{j.id}</td>
              <td className="border p-2">{j.title}</td>
              <td className="border p-2">{j.company_name}</td>
              <td className="border p-2">{new Date(j.deadline).toLocaleDateString()}</td>
              <td className="border p-2">
                <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      j.status === "hoạt động"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : j.status === "hết hạn"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {j.status || "Đang xử lý"}
                  </span>
              </td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => setSelectedJob(j.id)}
                  className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                    Xem chi tiết
                </button>

                <button
                  onClick={() => deleteJob(j.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedJob && (
        <JobDetailModalAdmin
            jobId={selectedJob}
            onClose={() => setSelectedJob(null)}
            onDeleted={() => fetchJobs()}
            onUpdated={() => fetchJobs()}
        />
     )}
    </div>
  );
}
