import axios from "axios";
const burl = import.meta.env.FRONTEND_URL
  ? "/api"
  : "http://localhost:5000/api";
const api = axios.create({
  baseURL: burl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
