import { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const JobCard = ({ job, onClick }) => {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <div
        onClick={onClick}
        className="relative bg-white shadow-md p-4 rounded-xl hover:border-2 hover:border-teal-600 transition-all duration-200 cursor-pointer"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-teal-600 transition"
        >
          {liked ? (<BsHeartFill className="fill-teal-600 text-teal-600"/>) 
                 : (<BsHeart className="fill-teal-600 text-teal-600" />)
          }
        </button>

        <div className="flex items-center gap-3">
          <img
            src={`http://localhost:5000${job.logo}` || "/default-logo.png"}
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
    </>
  );
};

export default JobCard;
