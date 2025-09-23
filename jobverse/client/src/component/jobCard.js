import { BsHeart, BsHeartFill } from "react-icons/bs";

const JobCard = ({ job, onClick, saved, onToggleSave }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return (
    <div
      onClick={onClick}
      className="relative bg-white shadow-md p-4 rounded-xl hover:border-2 hover:border-teal-600 transition-all duration-200 cursor-pointer"
    >
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

      <div className="flex items-center gap-3">
        <img
          src={
            job.logo
              ? `${API_URL}${job.logo}`
              : `${API_URL}/uploads/default/logo_company_default.jpg`
          }
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-xs text-gray-500">{job.company_name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="bg-gray-100 text-sm px-2 py-1 rounded">
          {job.salary}
        </span>
        <span className="bg-gray-100 text-sm px-2 py-1 rounded">
          {job.location}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
