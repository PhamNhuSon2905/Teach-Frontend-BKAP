import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { motion } from "framer-motion";
import {
  PlayCircleOutline,
  Search,
  FilterList,
  Star,
  People,
  AccessTime,
  TrendingUp,
  MenuBook,
  Code,
  DesignServices,
  DataObject,
  Cloud,
  Security,
} from "@mui/icons-material";
import courseApi from "../api/courseApi";


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  useScrollToTop();

  const categories = [
    { label: "Tất cả", value: "all", icon: <MenuBook /> },
    { label: "Lập trình", value: "programming", icon: <Code /> },
    { label: "Thiết kế", value: "design", icon: <DesignServices /> },
    { label: "Dữ liệu", value: "data", icon: <DataObject /> },
    { label: "Cloud", value: "cloud", icon: <Cloud /> },
    { label: "Bảo mật", value: "security", icon: <Security /> },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* ========== HERO SECTION ========== */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Stack alignItems="center" textAlign="center" spacing={3}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  textShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                Khám phá tri thức
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  maxWidth: 700,
                  opacity: 0.95,
                  lineHeight: 1.8,
                }}
              >
                Hơn 50+ khóa học chất lượng cao từ các chuyên gia hàng đầu. Học mọi lúc, mọi
                nơi với Aptech.
              </Typography>

              {/* Search Bar */}
              <Paper
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  mt: 2,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchQuery("")} size="small">
                          ×
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      "& fieldset": { border: "none" },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      py: 0.5,
                    },
                  }}
                />
              </Paper>
            </Stack>
          </motion.div>

        
        </Container>
      </Box>

      {/* ========== FILTERS ========== */}
      <Container sx={{ mt: -4, position: "relative", zIndex: 2 }}>
        <Paper
          sx={{
            borderRadius: 4,
            p: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
          >
            <Tabs
              value={selectedCategory}
              onChange={(e, v) => setSelectedCategory(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 48,
                },
              }}
            >
              {categories.map((cat) => (
                <Tab
                  key={cat.value}
                  value={cat.value}
                  label={cat.label}
                  icon={cat.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
            <Chip
              label={`${filteredCourses.length} khóa học`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Paper>
      </Container>

     

      {/* ========== CTA SECTION ========== */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container>
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Typography variant="h4" fontWeight={800}>
              Chưa tìm thấy khóa học phù hợp?
            </Typography>
            <Typography color="text.secondary" maxWidth={600}>
              Liên hệ với chúng tôi để được tư vấn và gợi ý các khóa học phù hợp nhất với nhu cầu
              của bạn
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/contact")}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #1976d2)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Liên hệ tư vấn
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}