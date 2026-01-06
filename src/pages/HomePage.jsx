import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import axios from "axios";

import videoBackground from "../assets/videos/mixkit-sparkling-particles-on-blue-background-18154-hd-ready.mp4";

const HomePage = ({ setShowLogin }) => {
  const navigate = useNavigate();
  useScrollToTop();


  // ===== CLICK KHÁM PHÁ =====
  const handleExplore = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLogin(true);
      return;
    }

    // Đã login → vào trang teacher lessons
    navigate("/teacher/lessons");
  };

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ================= HERO SECTION ================= */}
      <div style={{ maxWidth: "1400px", margin: "60px auto", padding: "0 50px" }}>
        <section
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "480px",
            position: "relative",
          }}
        >
          <video
            autoPlay
            muted
            loop
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
            }}
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
            }}
          />
          <div
            style={{
              padding: "100px 80px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                fontWeight: 900,
                marginBottom: "24px",
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              Tìm kiếm <br />
              <span style={{ color: "#4fc3f7" }}>Bài giảng</span> cho giảng viên
            </h1>

            <p
              style={{
                fontSize: "20px",
                color: "#fff",
                opacity: 0.95,
                marginBottom: "48px",
                maxWidth: "520px",
              }}
            >
              Khám phá các bài giảng, tài liệu chất lượng dành cho giảng viên.
            </p>

            <button
              onClick={handleExplore}
              style={{
                background: "#ffd700",
                color: "#333",
                fontWeight: 800,
                border: "none",
                borderRadius: "12px",
                padding: "16px 40px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              Khám phá ngay
            </button>
          </div>
        </section>
      </div>
      </div>
  );
};

export default HomePage;
