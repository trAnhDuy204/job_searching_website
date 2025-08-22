import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {axiosCandidate} from "../JWT/axiosClient";

export default function SearchBar() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
    job_type: "",
  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // Gọi API lẫy dữ liệu lọc
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes, typeRes] = await Promise.all([
          axiosCandidate.get("/categories"),
          axiosCandidate.get("/locations"),
          axiosCandidate.get("/job-types"),
        ]);

        setCategories(catRes.data);
        setLocations(locRes.data);
        setJobTypes(typeRes.data);
      } catch (error) {
        console.error("Lỗi khi gọi API dropdown:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (filters.keyword) queryParams.append("keyword", filters.keyword);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.job_type) queryParams.append("job_type", filters.job_type);

    if(localStorage.getItem("token_ungvien"))
        navigate(`/trang-tim-viec?${queryParams.toString()}`);
    else
        navigate(`/trang-chu-tim-viec?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 grid grid-cols-3 gap-3 items-center">
      {/* Ô keyword */}
      <input
        type="text"
        placeholder="Nhập từ khóa..."
        className="border text-black p-2 rounded flex-1 min-w-[200px]"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        onKeyDown={handleKeyPress}
      />

      {/* Select ngành nghề */}
      <select
        className="border text-black p-2 rounded min-w-[150px]"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        onKeyDown={handleKeyPress}
      >
        <option value="">Ngành nghề</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Select địa điểm */}
      <select
        className="border text-black p-2 rounded min-w-[150px]"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        onKeyDown={handleKeyPress}
      >
        <option value="">Địa điểm</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      {/* Select loại việc */}
      <select
        className="border text-black p-2 rounded min-w-[150px]"
        value={filters.job_type}
        onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
        onKeyDown={handleKeyPress}
      >
        <option value="">Hình thức</option>
        {jobTypes.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {/* Nút tìm kiếm */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
