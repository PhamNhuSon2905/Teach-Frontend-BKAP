import axiosClient from "./axiosClient";

const profileApi = {
  getMe() {
    return axiosClient.get("/teacher/profile/me");
  },

  updateProfile(formData) {
    return axiosClient.put("/teacher/profile/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default profileApi;
