import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  const loginUser = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
};


    const updateUser = (newUser) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
