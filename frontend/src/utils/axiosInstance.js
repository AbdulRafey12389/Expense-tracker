import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response || {};

    switch (status) {
      case 401:
        // Unauthorized - token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;
      case 403:
        // Forbidden - no permission
        console.error("Access forbidden");
        break;
      case 404:
        // Not found
        console.error("Resource not found");
        break;
      case 500:
        // Server error
        console.error("Server error occurred");
        break;
      default:
        console.error("An error occurred:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
