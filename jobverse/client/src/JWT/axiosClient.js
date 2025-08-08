import axios from "axios";

// Axios cho nhà tuyển dụng
export const axiosRecruiter = axios.create({ baseURL: "http://localhost:5000/api" });
axiosRecruiter.interceptors.request.use(config => {
  const token = localStorage.getItem("token_nhatuyendung");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios cho ứng viên
export const axiosCandidate = axios.create({ baseURL: "http://localhost:5000/api" });
axiosCandidate.interceptors.request.use(config => {
  const token = localStorage.getItem("token_ungvien");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios cho admin
export const axiosAdmin = axios.create({ baseURL: "http://localhost:5000/api" });
axiosAdmin.interceptors.request.use(config => {
  const token = localStorage.getItem("token_admin");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
