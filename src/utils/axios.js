import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiUrl = rawApiUrl?.replace(/\/+$/g, "");

if (!normalizedApiUrl && !import.meta.env.DEV) {
  throw new Error(
    "VITE_API_URL is not defined. Set it in your deployment environment variables."
  );
}

const BASE_URL = normalizedApiUrl
  ? `${normalizedApiUrl}/api`
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("starhotel_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;