import React, { useEffect, useState } from "react";
import { axiosCandidate } from "../../JWT/axiosClient";

const AppliedJobsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {

      try {
        const res = await axiosCandidate.get(`/applications/candidate`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_ungvien")}`,
        },
      });
        setApplications(res.data);
      } catch (err) {
        console.error("Lỗi tải danh sách đơn ứng tuyển:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  });

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Đang tải...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 relative">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Tiêu đề</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Công ty</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Ngày nộp</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="border px-4 py-3">{app.job_title}</td>
                <td className="border px-4 py-3">{app.company_name}</td>
                <td className="border px-4 py-3">
                  {app.applied_at
                    ? new Date(app.applied_at).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      app.status === "đã duyệt"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : app.status === "từ chối"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }`}
                  >
                    {app.status || "Đang xử lý"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-6 text-gray-500">
                Chưa nộp đơn ứng tuyển nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobsManagement;
