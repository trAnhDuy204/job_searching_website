import React, { useEffect, useState } from "react";
import { axiosRecruiter } from "../../JWT/axiosClient";

export default function ApplicationManagement() {
  const user = JSON.parse(localStorage.getItem("user_nhatuyendung"));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosRecruiter.get("/api/manage-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_nhatuyendung")}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách đơn ứng tuyển.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openModal = (app, status) => {
    setSelectedApp(app);
    setNewStatus(status);
    setMessageContent(""); // reset nội dung
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedApp || !newStatus) return;
    setUpdatingId(selectedApp.application_id);

    try {
      // Gửi tin nhắn
      const resMessage = await axiosRecruiter.post(
        `/api/messages/`,
        {
          sender_id: user.id,
          receiver_id: selectedApp.candidate_id,
          subject:
            newStatus === "đã duyệt"
              ? `Đơn ứng tuyển ${selectedApp.job_title} đã được duyệt`
              : `Đơn ứng tuyển ${selectedApp.job_title} đã bị từ chối`,
          content: messageContent || // nếu để trống thì dùng mặc định
            (newStatus === "đã duyệt"
              ? `Xin chúc mừng! Đơn ứng tuyển của bạn cho vị trí "${selectedApp.job_title}" đã được duyệt.`
              : `Rất tiếc, đơn ứng tuyển của bạn cho vị trí "${selectedApp.job_title}" đã bị từ chối.`),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_nhatuyendung")}`,
          },
        }
      );
      
      //lấy id tin nhắn để tạo thông báo
      const messageId = resMessage.data?.id;

      // Tạo thông báo
      await axiosRecruiter.post(
        `/api/notifications/`,
        {
          user_id: selectedApp.candidate_id,
          message_id: messageId,
          type: "job_status",
          content:
            newStatus === "đã duyệt"
              ? `Đơn ứng tuyển "${selectedApp.job_title}" của bạn đã được duyệt`
              : `Đơn ứng tuyển "${selectedApp.job_title}" của bạn đã bị từ chối`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_nhatuyendung")}`,
          },
        }
      );

      // Đổi trạng thái đơn
      await axiosRecruiter.put(
        `/api/manage-applications/${selectedApp.application_id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_nhatuyendung")}`,
          },
        }
      );

      setApplications((apps) =>
        apps.map((app) =>
          app.application_id === selectedApp.application_id
            ? { ...app, status: newStatus }
            : app
        )
      );
      setShowModal(false);
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Đang tải danh sách đơn ứng tuyển...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 relative">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Công việc</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Ứng viên</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Email</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Ngày nộp</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">CV</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Trạng thái</th>
            <th className="border px-4 py-3 text-left font-medium text-gray-700">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.application_id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                <td className="border px-4 py-3 text-left font-medium text-gray-700">{app.job_title}</td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">{app.full_name || "(Chưa cập nhật)"}</td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">{app.email}</td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">
                  {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="border px-4 py-3 text-left font-medium text-gray-700">
                  {app.cv_url ? (
                    <a
                      href={`${app.cv_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Xem
                    </a>
                  ) : (
                    "Không có"
                  )}
                </td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
                      app.status === "đã duyệt"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : app.status === "từ chối"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-2">
                  {app.status !== "đã duyệt" && (
                    <button
                      disabled={updatingId === app.application_id}
                      onClick={() => openModal(app, "đã duyệt")}
                      className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Duyệt
                    </button>
                  )}
                  {app.status !== "từ chối" && (
                    <button
                      disabled={updatingId === app.application_id}
                      onClick={() => openModal(app, "từ chối")}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Từ chối
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Chưa có đơn ứng tuyển nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4">
              {newStatus === "đã duyệt" ? "Gửi tin nhắn duyệt" : "Gửi tin nhắn từ chối"}
            </h2>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows="5"
              placeholder="Nhập nội dung tin nhắn..."
              className="w-full border rounded-lg p-3 mb-4"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={updatingId === selectedApp.application_id}
                className="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
              >
                Gửi & Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
