// task-management-frontend/src/api/http.js
import axios from "axios";

const base = process.env.REACT_APP_API_BASE || "https://localhost:7169/api";
console.log("API BASE =", base);

const http = axios.create({
  baseURL: base,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

http.interceptors.request.use((config) => {
  const saved = localStorage.getItem("user");
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
