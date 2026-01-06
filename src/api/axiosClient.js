import axios from "axios";
import { toast } from "../ui/toast";


const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_DEV_API_URL + "/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }

    return Promise.reject(err);
  }
);


export default axiosClient;
