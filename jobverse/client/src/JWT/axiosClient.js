import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const axiosClient = axios.create({
  baseURL: API_URL,
});

// map role
const tokenMap = {
  nhatuyendung: "token_nhatuyendung",
  ungvien: "token_ungvien",
  admin: "token_admin",
};

axiosClient.interceptors.request.use((config) => {
  const role = localStorage.getItem("role"); 
  const tokenKey = tokenMap[role];

  if (tokenKey) {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});