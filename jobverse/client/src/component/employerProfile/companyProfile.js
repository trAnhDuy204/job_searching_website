import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import {axiosRecruiter} from "../../JWT/axiosClient";
import EditCompanyModal from "./editCompanyModal";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CompanyProfileHeader = () => {
  const [company, setCompany] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    user_id:"",
    company_name: "",
    logo_url: "",
    industry: "",
    company_size: "",
    website: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const res = await axiosRecruiter.get("/api/company/me");
        setCompany(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy hồ sơ công ty:", err);
      }
    };
    fetchCompanyProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosRecruiter.put("/api/company/me", form);
      setCompany(form);
      setIsOpen(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật công ty:", err);
    }
  };

  if (!company) return <div>Đang tải hồ sơ công ty...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:justify-between gap-6 relative">
      {/* Logo + Tên công ty */}
      <div className=" flex gap-4 items-start flex-1">
        <div className="relative w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          {company.logo_url && (
            <img
              src={`${company.logo_url}`|| `${API_URL}/uploads/default/logo_company_default.jpg`}
              alt="logo"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="space-y-1">
          <div className="text-lg font-semibold">{company.company_name}</div>
          <div className="text-gray-500 text-sm">{company.address}</div>
        </div>
      </div>

      {/* Thông tin công ty */}
      <div className="flex-1 space-y-2 text-sm text-gray-700">
        <div><strong>Ngành nghề:</strong> {company.industry}</div>
        <div><strong>Quy mô:</strong> {company.company_size}</div>
        <div><strong>Website:</strong> <a href={company.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">{company.website}</a></div>
        <div><strong>Giới thiệu:</strong> {company.description}</div>
      </div>

      {/* Nút chỉnh sửa */}
      <button onClick={() => setIsOpen(true)} className="absolute top-4 right-4 text-gray-500 hover:text-teal-600">
        <FiEdit2 />
      </button>

      {/* Modal chỉnh sửa */}
      <EditCompanyModal isOpen={isOpen} onClose={() => setIsOpen(false)} form={form} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
  );
};

export default CompanyProfileHeader;
