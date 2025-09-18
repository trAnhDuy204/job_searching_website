// src/components/admin/JobDetailModalAdmin.jsx
import React, { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";

export default function JobDetailModalAdmin({ jobId, onClose, onDeleted}) {
  const [job, setJob] = useState(null);
  const token = localStorage.getItem("token_admin") || localStorage.getItem("token_nhatuyendung");

  useEffect(() => {
    if (!jobId) return;
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axiosAdmin.get(`/admin/job-posts/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(res.data);
    } catch (err) {
      console.error("Lỗi lấy job:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Xóa tin tuyển dụng này?")) return;
    try {
      await axiosAdmin.delete(`/admin/job-posts/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Lỗi xóa job:", err);
      alert("Xóa thất bại");
    }
  };

  if (!jobId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{job?.title || "Chi tiết tin"}</h3>
        </div>

        {!job ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : (
          <div className="mt-4 text-sm text-gray-700 space-y-3">
            <div><b>Công ty:</b> {job.company_name}</div>
            <div><b>Địa điểm:</b> {job.location || "—"}</div>
            <div><b>Ngành:</b> {job.category || "—"}</div>
            <div><b>Loại:</b> {job.job_type || "—"}</div>
            <div><b>Lương:</b> {job.salary || "Thỏa thuận"}</div>
            <div><b>Mô tả:</b> <div className="whitespace-pre-line">{job.description || "—"}</div></div>
            <div><b>Hạn nộp:</b> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "—"}</div>
            <div><b>Trạng thái:</b> {job.status}</div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Xóa tin</button>
              <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
