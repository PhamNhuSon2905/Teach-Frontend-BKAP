import axiosClient from "../api/axiosClient";

export const login = async (username, password) => {
  const res = await axiosClient.post("/teacher/auth/login", {
    username,
    password
  });

  return res.data;
};
