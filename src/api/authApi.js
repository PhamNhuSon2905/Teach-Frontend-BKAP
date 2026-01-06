// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  login(data) {
    return axiosClient.post("/teacher/auth/login", data);
  },

  getProfile() {
    return axiosClient.get("/teacher/profile");
  },

  changePassword(data) {
    return axiosClient.post(
      "/teacher/profile/change-password",
      data
    );
  },
};

export default authApi;
