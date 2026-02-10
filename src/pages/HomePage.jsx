import React from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Box, Typography, Button, Container } from "@mui/material";
import videoBackground from "../assets/videos/mixkit-sparkling-particles-on-blue-background-18154-hd-ready.mp4";

const HomePage = ({ setShowLogin }) => {
  const navigate = useNavigate();
  useScrollToTop();

  const handleExplore = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLogin(true);
      return;
    }

    navigate("/teacher/lessons");
  };

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        minHeight: "100vh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        flexDirection: "column",
        pt: { xs: 4, md: 8 }, 
        pb: { xs: 4, md: 8 }
      }}
    >

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
        <Box
          component="section"
          sx={{
            borderRadius: { xs: "16px", md: "28px" }, // Bo góc nhỏ hơn trên mobile
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: { xs: "400px", md: "480px" }, // Chiều cao linh hoạt
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
  
          <Box
            component="video"
            autoPlay
            muted
            loop
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
              zIndex: 0
            }}
          >
            <source src={videoBackground} type="video/mp4" />
          </Box>

       
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
              zIndex: 1
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: { xs: 4, md: 10 }, 
              width: "100%",
              textAlign: { xs: "center", md: "left" } 
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "32px", sm: "42px", md: "56px" }, 
                fontWeight: 900,
                mb: 3,
                color: "#fff",
                lineHeight: 1.15,
              }}
            >
              Tìm kiếm <br />
              <Box component="span" sx={{ color: "#4fc3f7" }}>
                Bài giảng
              </Box>{" "}
              cho giảng viên
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                color: "#fff",
                opacity: 0.95,
                mb: { xs: 4, md: 6 },
                maxWidth: "520px",
                mx: { xs: "auto", md: 0 } 
              }}
            >
              Khám phá các bài giảng, tài liệu chất lượng dành cho giảng viên.
            </Typography>

            <Button
              onClick={handleExplore}
              variant="contained"
              sx={{
                background: "#ffd700",
                color: "#333",
                fontWeight: 800,
                borderRadius: "12px",
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "16px", md: "18px" },
                textTransform: "none",
                "&:hover": {
                  background: "#e6c200", 
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Khám phá ngay
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;