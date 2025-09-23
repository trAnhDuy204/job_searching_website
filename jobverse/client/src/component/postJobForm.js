import React, { useState, useEffect, useRef } from "react";
import {axiosRecruiter} from "../JWT/axiosClient";

const removeVietnameseTones = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const PostJobForm = () => {
  const [form, setForm] = useState({
    title: "",
    salary: "",
    category_id: "",
    location_id: "",
    job_type_id: "",
    description: "",
    deadline: "",
    company_id: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [searchCat, setSearchCat] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");

  const [openCat, setOpenCat] = useState(false);
  const [openLoc, setOpenLoc] = useState(false);
  const [openType, setOpenType] = useState(false);

  const catRef = useRef();
  const locRef = useRef();
  const typeRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!catRef.current?.contains(e.target)) setOpenCat(false);
      if (!locRef.current?.contains(e.target)) setOpenLoc(false);
      if (!typeRef.current?.contains(e.target)) setOpenType(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, locRes, typeRes] = await Promise.all([
          axiosRecruiter.get("/api/categories"),
          axiosRecruiter.get("/api/locations"),
          axiosRecruiter.get("/api/job-types"),
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
        setJobTypes(typeRes.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //thông báo khi nhập thiếu dữ liệu
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!form.salary.trim()) newErrors.salary = "Vui lòng nhập mức lương";
    if (!form.category_id) newErrors.category_id = "Chọn ngành nghề";
    if (!form.location_id) newErrors.location_id = "Chọn địa điểm";
    if (!form.job_type_id) newErrors.job_type_id = "Chọn loại công việc";
    if (!form.description.trim()) newErrors.description = "Nhập mô tả công việc";
    if (!form.deadline.trim()) newErrors.deadline = "Chọn hạn chót ứng tuyển";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axiosRecruiter.post("/jobPosts", form);
      alert("Đăng tin thành công!");
      setForm({
        ...form,
        title: "",
        salary: "",
        description: "",
        deadline: "",
        category_id: "",
        location_id: "",
        job_type_id: "",
      });
      setSearchCat("");
      setSearchLoc("");
      setSearchType("");
      setErrors({});
    } catch (err) {
      console.error("Lỗi khi đăng tin:", err);
      alert("Lỗi khi đăng tin.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">Đăng Tin Tuyển Dụng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Tiêu đề */}
        <div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề công việc"
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Lương */}
        <div>
          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Lương"
            className="w-full border p-2 rounded"
          />
          {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
        </div>

        {/* Ngành nghề */}
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
                  removeVietnameseTones(c.name || "").toLowerCase().includes(removeVietnameseTones(searchCat || "").toLowerCase())
                )
                .map((c) => (
                  <li
                    key={c.id}
                    onClick={() => {
                      setSearchCat(c.name);
                      setForm({ ...form, category_id: c.id });
                      setOpenCat(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {c.name}
                  </li>
                ))}
            </ul>
          )}
          {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
        </div>

        {/* Địa điểm */}
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
                  removeVietnameseTones(l.name || "").toLowerCase().includes(removeVietnameseTones(searchLoc || "").toLowerCase())
                )
                .map((l) => (
                  <li
                    key={l.id}
                    onClick={() => {
                      setSearchLoc(l.name);
                      setForm({ ...form, location_id: l.id });
                      setOpenLoc(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {l.name}
                  </li>
                ))}
            </ul>
          )}
          {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
        </div>

        {/* Loại công việc */}
        <div ref={typeRef} className="relative">
          <input
            value={searchType}
            onClick={() => setOpenType(true)}
            onChange={(e) => setSearchType(e.target.value)}
            placeholder="Loại công việc"
            className="w-full border p-2 rounded"
          />
          {openType && (
            <ul className="absolute z-10 w-full border rounded bg-white max-h-40 overflow-y-auto mt-1 shadow">
              {jobTypes
                .filter((j) =>
                  removeVietnameseTones(j.name || "").toLowerCase().includes(removeVietnameseTones(searchType || "").toLowerCase())
                )
                .map((j) => (
                  <li
                    key={j.id}
                    onClick={() => {
                      setSearchType(j.name);
                      setForm({ ...form, job_type_id: j.id });
                      setOpenType(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                  >
                    {j.name}
                  </li>
                ))}
            </ul>
          )}
          {errors.job_type_id && <p className="text-red-500 text-sm mt-1">{errors.job_type_id}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả công việc"
            className="w-full border p-2 rounded"
            rows="4"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Hạn chót ứng tuyển</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Đăng Tin
        </button>
      </form>
    </div>
  );
};

export default PostJobForm;
