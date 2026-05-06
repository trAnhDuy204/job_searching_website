import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../JWT/axiosClient";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes, typeRes] = await Promise.all([
          axiosClient.get("/api/categories"),
          axiosClient.get("/api/locations"),
          axiosClient.get("/api/job-types"),
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

    if (localStorage.getItem("token_ungvien"))
      navigate(`/trang-tim-viec?${queryParams.toString()}`);
    else
      navigate(`/trang-chu-tim-viec?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4">
      {/* Main row: keyword + button */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm..."
            className="w-full pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base transition"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Search button — visible on sm+ in the main row */}
        <button
          onClick={handleSearch}
          className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md whitespace-nowrap text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          Tìm kiếm
        </button>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="relative">
          <select
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition cursor-pointer"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Ngành nghề</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="relative">
          <select
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition cursor-pointer"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          >
            <option value="">Địa điểm</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="relative">
          <select
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition cursor-pointer"
            value={filters.job_type}
            onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
          >
            <option value="">Hình thức</option>
            {jobTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Mobile search button */}
      <button
        onClick={handleSearch}
        className="sm:hidden mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        Tìm kiếm
      </button>
    </div>
  );
}