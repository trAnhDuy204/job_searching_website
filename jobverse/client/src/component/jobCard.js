import { BsHeart, BsHeartFill } from "react-icons/bs";

const JobCard = ({ job, onClick, saved, onToggleSave }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm
                 hover:shadow-md hover:border-teal-200 cursor-pointer
                 transition-all duration-200 flex flex-col gap-3 h-full"
    >
      {/* Save button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave?.(job.id, saved);
        }}
        className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full
                    transition-all duration-200
                    ${saved
                      ? "bg-teal-50 text-teal-600"
                      : "text-gray-300 hover:bg-gray-50 hover:text-teal-400"
                    }`}
        aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
        title={saved ? "Bỏ lưu" : "Lưu tin"}
      >
        {saved
          ? <BsHeartFill className="w-4 h-4" />
          : <BsHeart className="w-4 h-4" />
        }
      </button>

      {/* Logo + Title */}
      <div className="flex items-start gap-3 pr-8">
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-100 bg-gray-50
                        flex items-center justify-center shrink-0">
          <img
            src={job.logo || `${API_URL}/uploads/default/logo_company_default.jpg`}
            alt={job.company_name}
            className="w-full h-full object-contain p-0.5"
            onError={(e) => {
              e.target.src = `${API_URL}/uploads/default/logo_company_default.jpg`;
            }}
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-0.5">
            {job.title}
          </h3>
          <p className="text-xs text-gray-400 truncate">{job.company_name}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {job.salary && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700
                           text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </span>
        )}
        {job.location && (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700
                           text-xs font-medium px-2.5 py-1 rounded-full border border-sky-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;