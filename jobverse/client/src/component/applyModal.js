import { useState } from "react";
import { axiosCandidate } from "../JWT/axiosClient";

export default function ApplyModal({ job, onClose}) {
  const user = JSON.parse(localStorage.getItem("user_ungvien"));
  const [formData, setFormData] = useState({
    cv: null,
    subject: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cv) {
      alert("Vui lòng chọn file CV trước khi nộp!");
      return;
    }

    if (!job?.title || !job?.post_id) {
      alert("Không xác định được tên công việc");
      return;
    }

    setLoading(true);
    let applicationId = null;

    try {
      // Upload CV
      const formDataUpload = new FormData();
      formDataUpload.append("cv", formData.cv);
      formDataUpload.append("job_title", job.title);

      const resApply = await axiosCandidate.post(
        "/applications/apply",
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_ungvien")}`,
          },
        }
      );

      applicationId = resApply.data.application_id; // backend trả về id ứng tuyển

      // Nếu apply thành công thì gửi message
      const resMessage = await axiosCandidate.post(
        "/messages/",
        {
          sender_id: user.id,
          receiver_id: job.post_id,
          subject: formData.subject || `Ứng tuyển vào ${job.title}`,
          content: formData.content || "Xin chào, tôi muốn ứng tuyển công việc này.",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_ungvien")}`,
          },
        }
      );
      
      //lấy id tin nhắn để tạo thông báo
      const messageId = resMessage.data?.id;

      // Sau khi gửi message thì tạo notification cho nhà tuyển dụng
      await axiosCandidate.post(
        "/notifications",
        {
          user_id: job.post_id,
          message_id: messageId,
          type: "job_apply",
          content: `Ứng viên mới vừa ứng tuyển công việc ${job.title}.`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_ungvien")}`,
          },
        }
      );

      // Nếu thành công
      alert("Nộp đơn và gửi tin nhắn thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi nộp đơn:", error);

      // Nếu message lỗi thì xoá application vừa tạo để rollback
      if (applicationId) {
        try {
          await axiosCandidate.delete(`/applications/${applicationId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_ungvien")}`,
            },
          });
          console.log("Đã rollback application do lỗi message");
        } catch (rollbackError) {
          console.error("Lỗi rollback application:", rollbackError);
        }
      }

      if (error.response) {
        alert(error.response.data.error || "Có lỗi xảy ra khi nộp đơn!");
      } else if (error.request) {
        alert("Không nhận được phản hồi từ server!");
      } else {
        alert("Lỗi khi gửi request: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Ứng tuyển vào {job.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File CV */}
          <div>
            <label className="block font-medium mb-1">Chọn CV của bạn</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Tiêu đề tin nhắn */}
          <div>
            <label className="block font-medium mb-1">Tiêu đề tin nhắn</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder={`Ứng tuyển vào ${job.title}`}
              required
            />
          </div>

          {/* Nội dung tin nhắn */}
          <div>
            <label className="block font-medium mb-1">Nội dung tin nhắn</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Xin chào, tôi muốn ứng tuyển công việc này..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Đang nộp..." : "Nộp đơn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
