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
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);

// Attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;