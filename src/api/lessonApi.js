// src/api/authApi.js
import axiosClient from "./axiosClient";

const lessonApi = {
  getMyLessons() {
    return axiosClient.get("/teacher/lessons");
  },

  getLessonDetail(id) {
    return axiosClient.get(`/teacher/lessons/${id}`);
  },
};

export default lessonApi;
