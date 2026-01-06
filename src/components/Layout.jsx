import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import aptechLogo from "../assets/images/images.png";

/**
 * Layout tổng thể: Navbar + Nội dung + Footer
 */
const Layout = ({ setShowLogin, children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily:
          '"Montserrat", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* ===== NAVBAR ===== */}
      <Navbar setShowLogin={setShowLogin}/>

      {/* ===== MAIN CONTENT ===== */}
      <main
        style={{
          flex: 1,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {children || <Outlet />}
      </main>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          borderTop: "1px solid #eee",
          backgroundColor: "#fff",
          padding: "60px 80px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          fontSize: "14px",
        }}
      >
        {/* === CỘT 1: LOGO & MẠNG XÃ HỘI === */}
        <div>
          <img
            src={aptechLogo}
            alt="Aptech Library"
            style={{
              height: "100px",
              marginBottom: "12px",
              objectFit: "contain",
            }}
          />
          <p
            style={{
              color: "#666",
              lineHeight: 1.6,
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            Kho học liệu số - nơi giảng viên và sinh viên chia sẻ tri thức và sáng tạo.
          </p>

          {/* === ICON MẠNG XÃ HỘI === */}
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            {socialIcons.map((icon, i) => (
              <a
                key={i}
                href={icon.link}
                title={icon.title}
                style={{
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  background: icon.bg,
                  color: "#fff",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {icon.svg()}
              </a>
            ))}
          </div>
        </div>

        {/* === CÁC CỘT LINK === */}
        <FooterColumn
          title="Tính năng"
          links={["Khóa học", "Slide học tập", "Bảng xếp hạng"]}
        />
        <FooterColumn
          title="Tìm hiểu"
          links={["Giới thiệu", "Blog", "Tin tức", "Câu chuyện học viên"]}
        />
        <FooterColumn
          title="Hỗ trợ"
          links={["Liên hệ", "Câu hỏi thường gặp", "Điều khoản"]}
        />

        {/* === DÒNG BẢN QUYỀN === */}
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            marginTop: "40px",
            color: "#999",
            fontSize: "13px",
            borderTop: "1px solid #eee",
            paddingTop: "16px",
          }}
        >
          © 2025 Aptech Library – All rights reserved.
        </div>
      </footer>
    </div>
  );
};

/* ======= ICON MẠNG XÃ HỘI ======= */
const socialIcons = [
  {
    title: "Instagram",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    link: "#",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
      </svg>
    ),
  },
  {
    title: "Facebook",
    bg: "#1877F2",
    link: "#",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326V22.67c0 .73.6 1.33 1.325 1.33H12.82V14.7h-3.2v-3.6h3.2V8.412c0-3.177 1.943-4.907 4.78-4.907 1.36 0 2.53.1 2.87.145v3.33h-1.97c-1.547 0-1.85.735-1.85 1.813V11.1h3.7l-.48 3.6h-3.22v9.3h6.32c.73 0 1.33-.6 1.33-1.33V1.326C24 .6 23.4 0 22.675 0z" />
      </svg>
    ),
  },
  {
    title: "Twitter / X",
    bg: "#000",
    link: "#",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.36 2H21.5l-7.46 8.56L22 22h-6.64l-5.19-6.39L4.24 22H1l8.02-9.21L2 2h6.75l4.65 5.72L18.36 2zm-1.16 17.52h1.77L7.56 4.33H5.64l11.56 15.19z" />
      </svg>
    ),
  },
];

/* ======= CỘT FOOTER ======= */
const FooterColumn = ({ title, links }) => (
  <div>
    <h4
      style={{
        fontWeight: 700,
        marginBottom: "10px",
        color: "#000",
        textTransform: "uppercase",
        fontSize: "13px",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </h4>
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        color: "#666",
        lineHeight: 1.8,
        fontSize: "13px",
      }}
    >
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            style={{
              color: "#666",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#000")}
            onMouseLeave={(e) => (e.target.style.color = "#666")}
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Layout;
