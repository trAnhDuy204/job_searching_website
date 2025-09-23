import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosCandidate } from "../../JWT/axiosClient";
import JobCard from "component/jobCard";
import JobDetailModal from "component/jobDetailModal";

const removeVietnameseTones = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export default function EmployeeJobSearch() {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    job_type: "",
    keyword: ""
  });
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  // input text hiển thị trong dropdown
  const [searchCat, setSearchCat] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");

  // state mở/đóng dropdown
  const [openCat, setOpenCat] = useState(false);
  const [openLoc, setOpenLoc] = useState(false);
  const [openType, setOpenType] = useState(false);

  // refs để detect click outside
  const catRef = useRef(null);
  const locRef = useRef(null);
  const typeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(false);
      if (locRef.current && !locRef.current.contains(e.target)) setOpenLoc(false);
      if (typeRef.current && !typeRef.current.contains(e.target)) setOpenType(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // gọi API lấy danh sách tin đã lọc
  const fetchJobs = async () => {
    try {
      // chuẩn hóa keyword: bỏ dấu, viết thường
      const normalizedKeyword = removeVietnameseTones(filters.keyword || "").toLowerCase();

      // gọi API lấy tất cả jobs với filters khác
      const res = await axiosCandidate.get("/api/jobPosts/candidate/search", {
        params: {
          category: filters.category,
          location: filters.location,
          job_type: filters.job_type,
        },
      });

      let jobData = res.data;

      // nếu có keyword thì lọc lại ở client
      if (normalizedKeyword.trim() !== "") {
        jobData = jobData.filter((job) =>
          removeVietnameseTones(job.title).toLowerCase().includes(normalizedKeyword)
        );
      }

      setJobs(jobData);
    } catch (err) {
      console.error(err);
    }
  };


  // API lấy dữ liệu lọc theo yêu cầu
  const fetchMetaData = async () => {
    try {
      const [catRes, locRes, typeRes] = await Promise.all([
        axiosCandidate.get("/api/categories"),
        axiosCandidate.get("/api/locations"),
        axiosCandidate.get("/api/job-types")
      ]);
      setCategories(catRes.data);
      setLocations(locRes.data);
      setJobTypes(typeRes.data);
    } catch (err) {
      console.error("Lỗi metadata:", err);
    }
  };

  useEffect(() => {
    fetchMetaData();
    fetchJobs();
  }, []);

  // Với 3 ô select thì lọc ngay khi thay đổi
  useEffect(() => {
    if (filters.category || filters.location || filters.job_type) {
      fetchJobs();
    } else if (!filters.keyword) {
      // nếu bỏ hết select và không có keyword thì load lại tất cả
      fetchJobs({ keyword: "" });
    }
  }, [filters.category, filters.location, filters.job_type]);


  // xem chi tiết công việc
  const handleJobClick = (job) => {
    const token = localStorage.getItem("token_ungvien");
    if (!token) {
      alert("Vui lòng đăng nhập để xem chi tiết công việc.");
      return;
    }
    setSelectedJob(job);
  };

  //lấy dữ liệu lọc từ trang chủ

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const job_type = searchParams.get("job_type") || "";

    setFilters({ keyword, category, location, job_type });

    // gọi API lần đầu theo query
    fetchJobs();
  }, [searchParams]);

  // gọi API lưu tin
  const handleToggleSave = async (jobId) => {
    const token = localStorage.getItem("token_ungvien");
    if (!token) {
      alert("Vui lòng đăng nhập để lưu tin.");
      return;
    }
    try {
      const res = await axiosCandidate.post(`/api/saved-jobs/toggle`, {
        job_post_id: jobId
      });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, is_saved: res.data.saved } : job
        )
      );
    } catch (err) {
      console.error("Toggle save error:", err);
      alert("Không thể lưu/bỏ lưu tin. Vui lòng thử lại.");
    }
  };

  const closeModal = () => setSelectedJob(null);
  // Bắt sự kiện Enter trong ô input keyword
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchJobs();
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Bộ lọc */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Dropdown ngành nghề */}
        <div ref={catRef} className="relative">
          <input
            value={searchCat}
            onClick={() => setOpenCat(true)}
            onChange={(e) => setSearchCat(e.target.value)}
            placeholder="Ngành nghề"
            className="w-full border p-2 rounded"
          />
          {openCat && (
            <ul className="absolute z-10 w-full border rounded bg-white max-h-40 overflow-y-auto mt-1 shadow">
              {categories
                .filter((c) =>
                  removeVietnameseTones(c.name || "")
                    .toLowerCase()
                    .includes(
                      removeVietnameseTones(searchCat || "").toLowerCase()
                    )
                )
                .map((c) => (
                  <li
                    key={c.id}
                    onClick={() => {
                      setSearchCat(c.name);
                      setFilters({ ...filters, category: c.id });
                      setOpenCat(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {c.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Dropdown địa điểm */}
        <div ref={locRef} className="relative">
          <input
            value={searchLoc}
            onClick={() => setOpenLoc(true)}
            onChange={(e) => setSearchLoc(e.target.value)}
            placeholder="Địa điểm"
            className="w-full border p-2 rounded"
          />
          {openLoc && (
            <ul className="absolute z-10 w-full border rounded bg-white max-h-40 overflow-y-auto mt-1 shadow">
              {locations
                .filter((l) =>
                  removeVietnameseTones(l.name || "")
                    .toLowerCase()
                    .includes(
                      removeVietnameseTones(searchLoc || "").toLowerCase()
                    )
                )
                .map((l) => (
                  <li
                    key={l.id}
                    onClick={() => {
                      setSearchLoc(l.name);
                      setFilters({ ...filters, location: l.id });
                      setOpenLoc(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {l.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Dropdown loại việc */}
        <div ref={typeRef} className="relative">
          <input
            value={searchType}
            onClick={() => setOpenType(true)}
            onChange={(e) => setSearchType(e.target.value)}
            placeholder="Hình thức làm việc"
            className="w-full border p-2 rounded"
          />
          {openType && (
            <ul className="absolute z-10 w-full border rounded bg-white max-h-40 overflow-y-auto mt-1 shadow">
              {jobTypes
                .filter((t) =>
                  removeVietnameseTones(t.name || "")
                    .toLowerCase()
                    .includes(
                      removeVietnameseTones(searchType || "").toLowerCase()
                    )
                )
                .map((t) => (
                  <li
                    key={t.id}
                    onClick={() => {
                      setSearchType(t.name);
                      setFilters({ ...filters, job_type: t.id });
                      setOpenType(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {t.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Ô keyword */}
        <input
          type="text"
          placeholder="Tìm theo tiêu đề tin"
          className="border p-2 rounded col-span-1"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          onKeyDown={handleKeyDown}
        />

        {/* Nút tìm kiếm */}
        <button
          onClick={() => fetchJobs()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tìm kiếm
        </button>

        {/* Nút xóa bộ lọc */}
        <button
          onClick={() => {
            setFilters({ category: "", location: "", job_type: "", keyword: "" });
            fetchJobs({ category: "", location: "", job_type: "", keyword: "" });
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Danh sách job */}
      <div className="grid grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            saved={job.is_saved}
            onClick={() => handleJobClick(job)}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
}
