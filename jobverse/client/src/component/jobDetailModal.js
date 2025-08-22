import { useState } from "react";
import ApplyModal from "./applyModal";

const JobDetailModal = ({ job, onClose }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!job) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-lg">
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500"
          >
            x
          </button>

          {/* Thông tin công việc */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                job.logo
                  ? `http://localhost:5000${job.logo}`
                  : "/default-logo.png"
              }
              alt="Company Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company_name}</p>
            </div>
          </div>
          <p><strong>Lương:</strong> {job.salary}</p>
          <p><strong>Địa điểm:</strong> {job.location}</p>
          <p><strong>Ngành nghề:</strong> {job.category}</p>
          <p><strong>Loại công việc:</strong> {job.job_type}</p>
          <p className="mt-3"><strong>Mô tả:</strong></p>
          <p className="text-sm text-gray-600 max-h-60 overflow-y-auto whitespace-pre-wrap">
            {job.description}
          </p>
          <p className="mt-3">
            <strong>Hạn chót:</strong>{" "}
            {new Date(job.deadline).toLocaleDateString("vi-VN")}
          </p>

          {/* Nút Ứng tuyển */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
            >
              Ứng tuyển ngay
            </button>
          </div>
        </div>
      </div>

      {/* Modal nộp đơn */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
};

export default JobDetailModal;
