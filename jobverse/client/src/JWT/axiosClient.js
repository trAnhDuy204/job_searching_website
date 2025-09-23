import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Axios cho nhà tuyển dụng
export const axiosRecruiter = axios.create({ baseURL: API_URL });
axiosRecruiter.interceptors.request.use(config => {
  const token = localStorage.getItem("token_nhatuyendung");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios cho ứng viên
export const axiosCandidate = axios.create({ baseURL: API_URL });
axiosCandidate.interceptors.request.use(config => {
  const token = localStorage.getItem("token_ungvien");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios cho admin
export const axiosAdmin = axios.create({ baseURL: API_URL });
axiosAdmin.interceptors.request.use(config => {
  const token = localStorage.getItem("token_admin");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
