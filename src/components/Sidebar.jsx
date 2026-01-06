import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsIcon from "@mui/icons-material/Notifications";

const PRIMARY_BLUE = "#2563EB";
const NEUTRAL_GRAY = "#6B7280";
const HOVER_BG = "#F3F4F6";
const ACTIVE_BG = "rgba(37, 99, 235, 0.1)";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <HomeIcon />, label: "Trang chủ", path: "/" },
    { icon: <HomeIcon />, label: "Bài giảng", path: "/" },
    { icon: <BookIcon />, label: "Bài giảng", path: "/learning-path" },
    { icon: <ArticleIcon />, label: "Bài viết", path: "/posts" },
    { icon: <NotificationsIcon />, label: "Thông báo", path: "/notifications" },
  ];

  return (
    <Box
      sx={{
        width: 100,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 2,
        pb: 2,
        gap: 1,

        // ✅ Sidebar cố định khi cuộn
        position: "sticky",
        top: "64px", // khớp chiều cao Navbar
        height: "calc(100vh - 64px)",
        overflowY: "auto",

        // ✅ Không có vạch ngăn
        borderRight: "none",
        boxShadow: "none",

        // ✅ Ẩn scrollbar gọn gàng
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },

        fontFamily: "Inter, sans-serif",
        flexShrink: 0,
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          alignItems: "center",
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={index}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "12px",
                backgroundColor: isActive ? ACTIVE_BG : "transparent",
                transition: "background-color 0.2s ease-in-out",
                width: 80,
                "&:hover": {
                  backgroundColor: HOVER_BG,
                },
              }}
            >
              <Box
                sx={{
                  fontSize: 26,
                  color: isActive ? PRIMARY_BLUE : NEUTRAL_GRAY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isActive ? PRIMARY_BLUE : NEUTRAL_GRAY,
                  textAlign: "center",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
