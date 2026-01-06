import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip
} from "@mui/material";
import {
  Lock,
  AccountCircle,
  VpnKey,
  ExitToApp,
  VideoLibrary,
  Dashboard,
  Notifications,
  CalendarToday
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react"; // Thêm import useContext
import { AuthContext } from "../context/AuthContext"; // Thêm import AuthContext
import logo from "../assets/images/images.png";
import { toast } from "../ui/toast"; // Import toast mới

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext); // Sử dụng context

  // ===== STATE =====
  const [localUser, setLocalUser] = useState(null); // Đổi tên để tránh trùng với user từ context

  // ===== LOAD USER TỪ LOCALSTORAGE KHI COMPONENT MOUNT =====
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setLocalUser(JSON.parse(userData));
        console.log('✅ User loaded from localStorage:', JSON.parse(userData));
      } catch (e) {
        console.error('❌ Error parsing user from localStorage:', e);
      }
    }

    // Listen cho custom event userLoginSuccess từ LoginPage
    const handleUserLogin = (event) => {
      console.log('🔔 userLoginSuccess event received:', event.detail);
      setLocalUser(event.detail);
    };

    window.addEventListener('userLoginSuccess', handleUserLogin);

    // Listen cho storage change từ localStorage (khác tab)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        try {
          setLocalUser(JSON.parse(updatedUser));
          console.log('✅ User updated from storage event:', JSON.parse(updatedUser));
        } catch (e) {
          console.error('❌ Error parsing updated user:', e);
        }
      } else {
        setLocalUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('userLoginSuccess', handleUserLogin);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ===== MENU NGANG CƠ BẢN =====
  const baseMenuItems = ["Trang chủ", "Bài giảng", "Giới thiệu", "Liên hệ"];

  // ===== MENU THEO ROLE =====
  const getRoleSpecificMenu = () => {
    const currentUser = user || localUser; // Ưu tiên user từ context
    if (!currentUser) return [];

    const role = currentUser.role?.toUpperCase();

    if (role === "INSTRUCTOR") {
      return [
        { label: "Dashboard", path: "/teacher/dashboard", icon: <Dashboard /> },
        { label: "Bài giảng", path: "/teacher/lessons", icon: <VideoLibrary /> },
        { label: "Lịch dạy", path: "/teacher/schedule", icon: <CalendarToday /> },
        { label: "Thông báo", path: "/teacher/notifications", icon: <Notifications /> },
      ];
    }

    if (role === "ADMIN") {
      return [
        { label: "Dashboard", path: "/admin/dashboard", icon: <Dashboard /> },
        { label: "Quản lý người dùng", path: "/admin/users", icon: <AccountCircle /> },
      ];
    }

    return [];
  };

  // ===== DROPDOWN AVATAR =====
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // ===== POPUP ĐỔI MẬT KHẨU =====
  const [openPwdDialog, setOpenPwdDialog] = useState(false);
  const [pwd, setPwd] = useState({ old: "", new1: "", new2: "" });

  const handleChangePassword = () => {
    handleClose();
    setOpenPwdDialog(true);
  };

  const handleSavePassword = () => {
    if (!pwd.old || !pwd.new1 || !pwd.new2) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (pwd.new1 !== pwd.new2) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    toast.success("Đổi mật khẩu thành công!");
    setPwd({ old: "", new1: "", new2: "" });
    setOpenPwdDialog(false);
  };

  // ===== ĐIỀU HƯỚNG =====
  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuClick = (item) => {

  if (item === "Bài giảng") {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Vui lòng đăng nhập để truy cập !");
      setShowLogin(true);
      return;
    }

    // đã login
    navigate("/teacher/lessons");
    return;
  }

  // các menu khác giữ nguyên
  const routeMap = {
    "Trang chủ": "/",
    "Giới thiệu": "/about",
    "Liên hệ": "/contact",
  };

  navigate(routeMap[item] || "/");
};


  const handleRoleMenuClick = (menuItem) => {
    navigate(menuItem.path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logoutUser();
    setLocalUser(null); // Xóa user local
    toast.info("Đăng xuất tài khoản thành công !");
    navigate('/');
  };

  // ===== XÁC ĐỊNH MENU ĐANG ACTIVE =====
  const currentPath = location.pathname;
  const getActive = (item) => {
    const map = {
      "Trang chủ": "/",
      "Bài giảng": "/lesson",
      "Giới thiệu": "/about",
      "Liên hệ": "/contact",
    };
    return currentPath === map[item];
  };

  const getRoleActive = (menuItem) => {
    return currentPath === menuItem.path;
  };

  const currentUser = user || localUser; // Ưu tiên user từ context
  const roleSpecificMenu = getRoleSpecificMenu();

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid #eee",
          bgcolor: "#fff",
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* ===== LOGO ===== */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleLogoClick}
            >
              <img
                src={logo}
                alt="Aptech Logo"
                style={{
                  width: "300px",
                  height: "100px",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </Box>

            {/* ===== MENU CHÍNH + MENU ROLE ===== */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Menu cơ bản */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: "#f9f9f9",
                  px: 2,
                  py: 0.7,
                  borderRadius: "24px",
                }}
              >
                {baseMenuItems.map((item) => {
                  const isActive = getActive(item);
                  return (
                    <Button
                      key={item}
                      onClick={() => handleMenuClick(item)}
                      sx={{
                        color: isActive ? "#5E17EB" : "#111",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "13px",
                        textTransform: "none",
                        borderRadius: "20px",
                        backgroundColor: isActive
                          ? "rgba(94,23,235,0.08)"
                          : "transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(94,23,235,0.1)",
                        },
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </Box>

              {/* Menu theo role */}
              {roleSpecificMenu.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#e3f2fd",
                    px: 2,
                    py: 0.7,
                    borderRadius: "24px",
                    border: "1px solid #bbdefb"
                  }}
                >
                  {roleSpecificMenu.map((menuItem) => {
                    const isActive = getRoleActive(menuItem);
                    return (
                      <Button
                        key={menuItem.path}
                        onClick={() => handleRoleMenuClick(menuItem)}
                        startIcon={menuItem.icon}
                        sx={{
                          color: isActive ? "#1976d2" : "#1565c0",
                          fontWeight: isActive ? 700 : 600,
                          fontSize: "13px",
                          textTransform: "none",
                          borderRadius: "20px",
                          backgroundColor: isActive
                            ? "rgba(25,118,210,0.12)"
                            : "transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(25,118,210,0.15)",
                          },
                        }}
                      >
                        {menuItem.label}
                      </Button>
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* ===== LOGIN / AVATAR ===== */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {!currentUser ? (
                <>
                  <Button
                    onClick={() => setShowLogin && setShowLogin(true)}
                    sx={{
                      color: "#1976d2",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#f4f4f4" },
                    }}
                  >
                    Đăng nhập
                  </Button>
                </>
              ) : (
                <>
                  <Chip
                    label={currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Giảng viên'}
                    size="small"
                    color={currentUser.role === 'ADMIN' ? "error" : "success"}
                    variant="outlined"
                  />

                  <IconButton onClick={handleAvatarClick}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: currentUser.role?.toUpperCase() === 'ADMIN' ? '#f44336' :
                          currentUser.role?.toUpperCase() === 'INSTRUCTOR' ? '#1976d2' :
                            '#4caf50'
                      }}
                    >
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 240,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    {/* Header với avatar và tên */}
                    <Box
                      sx={{
                        px: 2.5,
                        py: 2,
                        background: currentUser.role === 'ADMIN' 
                          ? "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
                          : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          border: "2px solid #fff",
                          bgcolor: "transparent",
                        }}
                      >
                        {(currentUser.fullname || currentUser.username)?.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, fontSize: "12px" }}
                        >
                          Xin chào,
                        </Typography>

                        <Typography variant="subtitle1" fontWeight={700}>
                          {currentUser.fullname || currentUser.username}
                        </Typography>

                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                          {currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Giảng viên'}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />

                    {/* Menu Items với icons đẹp */}
                    <MenuItem
                      onClick={handleProfile}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        gap: 2,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                          "& .MuiListItemIcon-root": {
                            color: "#1976d2",
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto !important" }}>
                        <AccountCircle sx={{ fontSize: 22, color: "#1976d2" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Thông tin cá nhân"
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      />
                    </MenuItem>

                    <MenuItem
                      onClick={handleChangePassword}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        gap: 2,
                        "&:hover": {
                          backgroundColor: "rgba(255, 152, 0, 0.08)",
                          "& .MuiListItemIcon-root": {
                            color: "#ff9800",
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto !important" }}>
                        <VpnKey sx={{ fontSize: 22, color: "#ff9800" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Đổi mật khẩu"
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      />
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        gap: 2,
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.08)",
                          "& .MuiListItemIcon-root": {
                            color: "#f44336",
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto !important" }}>
                        <ExitToApp sx={{ fontSize: 22, color: "#f44336" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Đăng xuất"
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ===== POPUP ĐỔI MẬT KHẨU ===== */}
      <Dialog
        open={openPwdDialog}
        onClose={() => setOpenPwdDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
            background: currentUser?.role === 'ADMIN'
              ? "linear-gradient(135deg, #f44336 0%, #e57373 100%)"
              : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "#fff",
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Lock />
          Đổi mật khẩu
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              value={pwd.old}
              onChange={(e) => setPwd({ ...pwd, old: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={pwd.new1}
              onChange={(e) => setPwd({ ...pwd, new1: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              value={pwd.new2}
              onChange={(e) => setPwd({ ...pwd, new2: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2, px: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenPwdDialog(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePassword}
            sx={{
              background: currentUser?.role === 'ADMIN'
                ? "linear-gradient(90deg, #f44336 0%, #e57373 100%)"
                : "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": {
                background: currentUser?.role === 'ADMIN'
                  ? "linear-gradient(90deg, #d32f2f 0%, #f44336 100%)"
                  : "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
              },
            }}
          >
            Cập nhật mật khẩu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;