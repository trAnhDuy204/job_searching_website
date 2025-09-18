import { useEffect, useMemo, useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { axiosCandidate} from "../../JWT/axiosClient";
import JobDetailModal from "../jobDetailModal";
const removeVietnameseTones = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export default function ReviewCompanyLayout({companyId}) {
  console.log(companyId);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  console.log(selectedJob);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!companyId) {
        console.error("companyId chưa có");
        return;
    }

    let mounted = true;

    //lấy tin thông tin công ty
    const fetchCompany = async () => {
      setLoadingCompany(true);
      setError(null);
      try {
        const res = await axiosCandidate.get(`/company/${companyId}`);
        if (mounted) setCompany(res.data);

      } catch (err) {
        if (mounted) setError("Không tải được thông tin công ty.");
        console.error(err);
      } finally {
        if (mounted) setLoadingCompany(false);
      }
    };

    //lấy tin tuyển dụng của công ty
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await axiosCandidate.get(`/jobPosts/${companyId}/jobs`);
        if (mounted) setJobs(res.data || []);

      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingJobs(false);
      }
    };

    fetchCompany();
    fetchJobs();

    return () => { mounted = false; };
  }, [companyId]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const normalizedKeyword = removeVietnameseTones(keyword || "").toLowerCase();
      const matchKeyword =
        !keyword ||
        removeVietnameseTones(j.title).toLowerCase().includes(normalizedKeyword) ||
        removeVietnameseTones(j.location).toLowerCase().includes(normalizedKeyword);
      return matchKeyword;
    });
  }, [jobs, keyword]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleToggleSave = async (jobId) => {
    try {
        const res = await axiosCandidate.post(`/saved-jobs/toggle`, { job_post_id: jobId });
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

  if (loadingCompany) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="animate-pulse h-40 bg-gray-200 rounded-xl mb-6" />
        <div className="flex gap-4">
          <div className="w-28 h-28 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 w-1/3 rounded" />
            <div className="h-4 bg-gray-200 w-1/2 rounded" />
            <div className="h-4 bg-gray-200 w-1/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const closeModal = () => setSelectedJob(null);
  if (error) return <div className="max-w-6xl mx-auto p-4 text-red-600">{error}</div>;
  if (!company) return <div className="max-w-6xl mx-auto p-4">Không có dữ liệu công ty.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="w-full h-48 md:h-60 bg-gray-200">
        <img
          src={`http://localhost:5000/uploads/default/cover_company_default.png`}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative">
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden ring-4 ring-white -mt-12">
              {company.logo_url ? (
                <img src={`http://localhost:5000${company.logo_url}`} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                  {company.name?.charAt(0) || "C"}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold">{company.company_name}</h1>
              <div className="mt-1 text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                {company.industry && <span>Ngành: {company.industry}</span>}
                {company.company_size && <span>Quy mô: {company.company_size}</span>}
                {(company.address) && (
                  <span>Địa điểm: {company.address ? `${company.address}` : ""}</span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    Website
                  </a>
                )}
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    Email
                  </a>
                )}
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                  >
                    Gọi điện
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          {(company.description) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Section title="Giới thiệu">
                  <p className="text-gray-700 whitespace-pre-line">
                    {company.description || "Chưa có mô tả."}
                  </p>
                </Section>
              </div>
            </div>
          )}
        </div>

        {/* Jobs */}
        <div className="mt-6 bg-white rounded-2xl shadow p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-semibold">
              Tin tuyển dụng ({jobs.length})
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                className="border rounded-xl px-3 py-2 text-sm"
                placeholder="Tìm theo tiêu đề/địa chỉ"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

          </div>

          {loadingJobs ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-28 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-gray-600 mt-4">Không có tin phù hợp.</div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
              {filteredJobs.map((job) => (
                <JobCard 
                key={job.id || job.post_id} 
                job={job}
                saved={job.is_saved}
                onClick={() => handleJobClick(job)}
                onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>
      <div className="p-4 border rounded-xl">{children}</div>
    </div>
  );
}

function JobCard({ job, onClick, saved, onToggleSave }) {
  const title = job.title || job.job_title || "Vị trí chưa đặt tên";
  const loc = job.location || job.city || "";
  const type = job.job_type || job.type || "";
  const status = (job.status || "").toLowerCase();
  const createdAt = job.created_at || job.posted_at;
  const deadline = job.deadline;
  const salaryText = job.salary || "Thỏa thuận";

  return (
    <div
      onClick={onClick}
      className="relative block border rounded-2xl p-4 hover:shadow transition bg-white"
    >
      {localStorage.getItem("token_ungvien") &&(
        <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(job.id, saved);
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-teal-600 transition"
            aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
            title={saved ? "Bỏ lưu" : "Lưu tin"}
        >
            {saved ? <BsHeartFill className="text-teal-600" /> : <BsHeart />}
        </button>
      )}
      

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">
            {loc && <span>{loc}</span>}
            {type && <span> - {type}</span>}
          </div>
        </div>
        <span
          className={`absolute left-3/4 text-xs px-2.5 py-1 rounded-full border ${
            status === "hoạt động"
              ? "bg-green-50 text-green-700 border-green-200"
              : ""
          }`}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        Mức lương: <span className="font-medium">{salaryText}</span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {createdAt && (
          <span>Đăng: {new Date(createdAt).toLocaleDateString("vi-VN")}</span>
        )}
        {deadline && (
          <span> - Hạn: {new Date(deadline).toLocaleDateString("vi-VN")}</span>
        )}
      </div>
    </div>
  );
}
