import { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";
import CompanyDetailModal from "../../component/admin/CompanyDetailModal";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    const res = await axiosAdmin.get("/api/admin/companies");
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (id) => {
    if (window.confirm("Xóa công ty này?")) {
      await axiosAdmin.delete(`/api/admin/companies/${id}`);
      fetchCompanies();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Danh sách Công ty</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên công ty</th>
            <th className="border p-2">Ngành</th>
            <th className="border p-2">Website</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.company_name}</td>
              <td className="border p-2">{c.industry}</td>
              <td className="border p-2">{c.website}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => setSelectedCompany(c.id)}
                  className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => deleteCompany(c.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCompany && (
        <CompanyDetailModal
            companyId={selectedCompany}
            onClose={() => setSelectedCompany(null)}
            onDeleted={() => fetchCompanies()}
        />
      )}
    </div>
  );
}
