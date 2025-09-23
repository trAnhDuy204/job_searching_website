import React, { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";

export default function CompanyDetailModal({ companyId, onClose, onDeleted }) {
  const [company, setCompany] = useState(null);
  const token = localStorage.getItem("token_admin") || localStorage.getItem("token_nhatuyendung");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  useEffect(() => {
    if (!companyId) return;
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const res = await axiosAdmin.get(`/api/admin/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
    } catch (err) {
      console.error("Lỗi lấy company:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Xóa công ty sẽ xóa luôn tin tuyển dụng và hồ sơ liên quan. Chắc chắn?")) return;
    try {
      await axiosAdmin.delete(`/api/admin/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Lỗi xóa company:", err);
      alert("Xóa thất bại");
    }
  };

  if (!companyId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">Chi tiết công ty</h3>
        </div>

        {!company ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : (
          <div className="mt-4 space-y-3 text-gray-700 text-sm">
            <div className="flex gap-4 items-center">
              <img src={company.logo_url ? `${API_URL}${company.logo_url}` : `${API_URL}/uploads/default/logo_company_default.jpg`} alt="" className="w-24 h-24 object-cover rounded" />
              <div>
                <div className="text-lg font-semibold">{company.company_name}</div>
                <div className="text-xs text-gray-500">{company.industry} • {company.company_size}</div>
                <div className="mt-2"><a href={company.website} className="text-teal-600" target="_blank" rel="noreferrer">{company.website}</a></div>
              </div>
            </div>

            <div><b>Địa chỉ:</b> {company.address || "—"}</div>
            <div><b>Email:</b> {company.email || "—"}</div>
            <div><b>Mô tả:</b> <div className="whitespace-pre-line">{company.description || "—"}</div></div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Xóa công ty</button>
              <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
