import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import aptechLogo from "../assets/images/images.png";
import { Box, Typography, Grid, Link, Container } from "@mui/material";

/**
 * Layout tổng thể: Navbar + Nội dung + Footer
 */
const Layout = ({ setShowLogin, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#fff",
        fontFamily: '"Montserrat", "Inter", sans-serif',
      }}
    >
      <Navbar setShowLogin={setShowLogin} />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {children || <Outlet />}
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #eee",
          bgcolor: "#fff",
          p: { xs: "40px 20px", md: "60px 80px 20px" }, 
        }}
      >
        <Grid container spacing={4}>
          {/* === CỘT 1: LOGO & MẠNG XÃ HỘI === */}
          <Grid item xs={12} md={4} lg={3}>
            <Box>
              <img
                src={aptechLogo}
                alt="Aptech Library"
                style={{
                  height: "80px", 
                  marginBottom: "12px",
                  objectFit: "contain",
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                Kho học liệu số - nơi giảng viên và sinh viên chia sẻ tri thức và sáng tạo.
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                {socialIcons.map((icon, i) => (
                  <Box
                    key={i}
                    component="a"
                    href={icon.link}
                    title={icon.title}
                    sx={{
                      width: 38,
                      height: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      background: icon.bg,
                      color: "#fff",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    {icon.svg()}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <FooterColumn
              title="Tính năng"
              links={["Khóa học", "Slide học tập", "Bảng xếp hạng"]}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FooterColumn
              title="Tìm hiểu"
              links={["Giới thiệu", "Blog", "Tin tức", "Câu chuyện học viên"]}
            />
          </Grid>
          <Grid item xs={12} md={3}>
             <FooterColumn
              title="Hỗ trợ"
              links={["Liên hệ", "Câu hỏi thường gặp", "Điều khoản"]}
            />
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 5,
            pt: 2,
            borderTop: "1px solid #eee",
            color: "#999",
          }}
        >
          © 2025 Aptech Library – All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

const FooterColumn = ({ title, links }) => (
  <Box>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: 700,
        mb: 2,
        color: "#000",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {title}
    </Typography>
    <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
      {links.map((link) => (
        <Box component="li" key={link} sx={{ mb: 1 }}>
          <Link
            href="#"
            underline="none"
            sx={{
              color: "#666",
              fontSize: "14px",
              transition: "color 0.2s",
              "&:hover": { color: "#000" },
            }}
          >
            {link}
          </Link>
        </Box>
      ))}
    </Box>
  </Box>
);


const socialIcons = [
  {
    title: "Instagram",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    link: "#",
    svg: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" /></svg>
    ),
  },
  {
    title: "Facebook",
    bg: "#1877F2",
    link: "#",
    svg: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326V22.67c0 .73.6 1.33 1.325 1.33H12.82V14.7h-3.2v-3.6h3.2V8.412c0-3.177 1.943-4.907 4.78-4.907 1.36 0 2.53.1 2.87.145v3.33h-1.97c-1.547 0-1.85.735-1.85 1.813V11.1h3.7l-.48 3.6h-3.22v9.3h6.32c.73 0 1.33-.6 1.33-1.33V1.326C24 .6 23.4 0 22.675 0z" /></svg>
    ),
  },
  {
    title: "Twitter / X",
    bg: "#000",
    link: "#",
    svg: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.36 2H21.5l-7.46 8.56L22 22h-6.64l-5.19-6.39L4.24 22H1l8.02-9.21L2 2h6.75l4.65 5.72L18.36 2zm-1.16 17.52h1.77L7.56 4.33H5.64l11.56 15.19z" /></svg>
    ),
  },
];

export default Layout;