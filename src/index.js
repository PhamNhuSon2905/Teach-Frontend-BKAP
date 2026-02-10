import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Auto-clear localStorage on fresh app start (first time)
const isFirstVisit = !sessionStorage.getItem("app_started");
if (isFirstVisit) {
  console.log("First app start - clearing localStorage");
  localStorage.clear();
  sessionStorage.setItem("app_started", "true");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
