import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { axiosRecruiter } from "../../JWT/axiosClient";

export default function EditJobModal({ isOpen, jobData, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    category_id: "",
    location_id: "",
    job_type_id: "",
    description: "",
    deadline: "",
    status: "hoạt động",
  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load data dropdown khi mở modal
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("token_nhatuyendung");

      const [catsRes, locsRes, typesRes] = await Promise.all([
        axiosRecruiter.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosRecruiter.get("/locations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosRecruiter.get("/job-types", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(catsRes.data || []);
      setLocations(locsRes.data || []);
      setJobTypes(typesRes.data || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu dropdown:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Fill form khi có jobData
  useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData.title || "",
        salary: jobData.salary || "",
        category_id: jobData.category_id || "",
        location_id: jobData.location_id || "",
        job_type_id: jobData.job_type_id || "",
        description: jobData.description || "",
        deadline: jobData.deadline || "",
        status: jobData.status || "hoạt động",
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const token = localStorage.getItem("token_nhatuyendung");
      await axiosRecruiter.put(`/employer/jobs/${jobData.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật job:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Tiêu đề */}
        <Dialog.Title className="text-lg font-bold p-6 border-b">
          Chỉnh sửa công việc
        </Dialog.Title>

        {/* Nội dung cuộn */}
        <div className="p-6 overflow-y-auto flex-1">
          {loadingData ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : (
            <form
              id="editJobForm"
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4"
            >
              {/* Tiêu đề */}
              <div>
                <label className="block mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              {/* Lương */}
              <div>
                <label className="block mb-1">Lương</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block mb-1">Danh mục</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block mb-1">Địa điểm</label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">-- Chọn địa điểm --</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loại công việc */}
              <div>
                <label className="block mb-1">Loại công việc</label>
                <select
                  name="job_type_id"
                  value={formData.job_type_id}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">-- Chọn loại --</option>
                  {jobTypes.map((jt) => (
                    <option key={jt.id} value={jt.id}>
                      {jt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hạn nộp */}
              <div>
                <label className="block mb-1">Hạn nộp</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="hoạt động">Hoạt động</option>
                  <option value="ẩn">Ẩn</option>
                </select>
              </div>

              {/* Mô tả - full 2 cột */}
              <div className="col-span-2">
                <label className="block mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border p-2 w-full h-32"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer cố định */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="editJobForm"
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Lưu
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);
}
