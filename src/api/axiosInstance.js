import axios from "axios";
import { message } from "antd";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL_API, // đổi theo BE của bạn
});

// Thêm token vào header mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401 (token hết hạn → logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
