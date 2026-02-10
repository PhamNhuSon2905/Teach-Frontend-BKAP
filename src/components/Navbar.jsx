import { useState, useContext, useEffect } from "react"; 
import { buildFileUrl } from "../utils/fileUrl";
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
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton
} from "@mui/material";
import {
  Lock,
  AccountCircle,
  VpnKey,
  ExitToApp,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,          // Icon Trang chủ
  School as SchoolIcon,      // Icon Bài giảng
  Info as InfoIcon,          // Icon Giới thiệu
  ContactSupport as ContactIcon, // Icon Liên hệ
  Login as LoginIcon         // Icon Đăng nhập
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/images.png";
import { toast } from "../ui/toast";

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, logoutUser } = useContext(AuthContext);


  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const menuItems = [
    { text: "Trang chủ", icon: <HomeIcon />, path: "/" },
    { text: "Bài giảng", icon: <SchoolIcon />, path: "/lesson" }, // Path ảo để check active
    { text: "Giới thiệu", icon: <InfoIcon />, path: "/about" },
    { text: "Liên hệ", icon: <ContactIcon />, path: "/contact" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  

  useEffect(() => {
    setAnchorEl(null); 
  }, [currentUser]);

  const open = Boolean(anchorEl);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

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

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuClick = (itemText) => {
    if (mobileOpen) setMobileOpen(false);

    if (itemText === "Bài giảng") {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Vui lòng đăng nhập để truy cập !");
        setShowLogin(true);
        return;
      }
      navigate("/teacher/lessons");
      return;
    }

    const routeMap = {
      "Trang chủ": "/",
      "Giới thiệu": "/about",
      "Liên hệ": "/contact",
    };
    navigate(routeMap[itemText] || "/");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logoutUser();
    toast.info("Đăng xuất tài khoản thành công !");
    navigate('/');
  };

  const currentPath = location.pathname;
  const getActive = (itemText) => {
    const map = {
      "Trang chủ": "/",
      "Bài giảng": "/teacher/lessons", 
      "Giới thiệu": "/about",
      "Liên hệ": "/contact",
    };

    if (itemText === "Trang chủ") return currentPath === "/";
    return currentPath.startsWith(map[itemText]);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        <Box 
            sx={{ 
                py: 3, 
                px: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Gradient tím giống trang chủ
                color: "#fff",
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative'
            }}
        >
             <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.8)' }}
            >
                <CloseIcon />
            </IconButton>

            <Avatar 
                src={logo} 
                alt="Logo"
                variant="rounded"
                sx={{ width: 48, height: 48, bgcolor: 'white', p: 0.5, mb: 1.5, borderRadius: 2 }}
            >
                <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Avatar>
            
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                Aptech Library
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Kho học liệu số
            </Typography>
        </Box>

        <List sx={{ pt: 2, px: 2, flex: 1 }}>
            {menuItems.map((item) => {
                 const isActive = getActive(item.text);
                 return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton 
                            onClick={() => handleMenuClick(item.text)}
                            sx={{ 
                                borderRadius: 2,
                                py: 1.5,
                                color: isActive ? "#5E17EB" : "#4b5563",
                                bgcolor: isActive ? "rgba(94,23,235,0.08)" : "transparent",
                                "&:hover": {
                                    bgcolor: isActive ? "rgba(94,23,235,0.12)" : "rgba(0,0,0,0.04)",
                                },
                                transition: "all 0.2s"
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: isActive ? "#5E17EB" : "#6b7280" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{ 
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.95rem'
                                }} 
                            />
                        </ListItemButton>
                    </ListItem>
                 )
            })}
        </List>

        {!currentUser ? (
            <Box sx={{ p: 3, borderTop: '1px solid #f3f4f6' }}>
                 <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<LoginIcon />}
                    onClick={() => { setShowLogin(true); setMobileOpen(false); }}
                    sx={{ 
                        borderRadius: 2, 
                        py: 1.5, 
                        textTransform: 'none', 
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                        background: "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)"
                    }}
                >
                    Đăng nhập tài khoản
                 </Button>
            </Box>
        ) : (
            <Box sx={{ p: 3, borderTop: '1px solid #f3f4f6', bgcolor: '#f9fafb' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                     <Avatar 
                        src={currentUser?.avatar ? buildFileUrl(currentUser.avatar) : ""} 
                        sx={{ width: 40, height: 40 }}
                     >
                         {(currentUser.fullname || currentUser.username)?.charAt(0).toUpperCase()}
                     </Avatar>
                     <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap fontWeight={700}>{currentUser.fullname || currentUser.username}</Typography>
                        <Typography variant="caption" color="text.secondary">Đang hoạt động</Typography>
                     </Box>
                </Box>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    color="error"
                    startIcon={<ExitToApp />}
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Đăng xuất
                </Button>
            </Box>
        )}
    </Box>
  );

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
      
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: '#333' }}
            >
              <MenuIcon />
            </IconButton>

       
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                flexGrow: { xs: 1, md: 0 }, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mr: { xs: 6, md: 0 }
              }}
              onClick={handleLogoClick}
            >
              <img
                src={logo}
                alt="Aptech Logo"
                style={{
                  height: "auto",
                  maxHeight: "60px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                width={180}
              />
            </Box>

      
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: "center", gap: 2 }}>
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
                {menuItems.map((item) => {
                  const isActive = getActive(item.text);
                  return (
                    <Button
                      key={item.text}
                      onClick={() => handleMenuClick(item.text)}
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
                      {item.text}
                    </Button>
                  );
                })}
              </Box>
            </Box>

     
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {!currentUser ? (
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
                </Box>
              ) : (
                <>
                  <Chip
                    label="Giảng viên"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  />
                  <IconButton onClick={handleAvatarClick}>
                    <Avatar
                      src={buildFileUrl(currentUser.avatar)}
                      alt={currentUser.fullname}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid #fff",
                        bgcolor: "#1976d2",
                      }}
                    >
                      {currentUser.fullname?.charAt(0).toUpperCase()}
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
              
                      <Box
                      sx={{
                        px: 2.5,
                        py: 2,
                        background : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        src={currentUser?.avatar ? buildFileUrl(currentUser.avatar) : ""}
                        alt={currentUser?.fullname}
                        sx={{ width: 48, height: 48, border: "2px solid #fff", bgcolor: "transparent" }}
                      >
                        {(currentUser.fullname || currentUser.username)?.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "12px" }}>Xin chào,</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{currentUser.fullname || currentUser.username}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>Giảng viên</Typography>
                      </Box>
                    </Box>
                    <Divider />
                    
                    <MenuItem onClick={handleProfile} sx={{ py: 1.5, px: 2.5, gap: 2 }}>
                        <ListItemIcon sx={{ minWidth: "auto !important" }}> <AccountCircle sx={{ fontSize: 22, color: "#1976d2" }} /> </ListItemIcon>
                        <ListItemText primary="Thông tin cá nhân" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                    </MenuItem>

                    <MenuItem onClick={handleChangePassword} sx={{ py: 1.5, px: 2.5, gap: 2 }}>
                        <ListItemIcon sx={{ minWidth: "auto !important" }}> <VpnKey sx={{ fontSize: 22, color: "#ff9800" }} /> </ListItemIcon>
                        <ListItemText primary="Đổi mật khẩu" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2.5, gap: 2 }}>
                        <ListItemIcon sx={{ minWidth: "auto !important" }}> <ExitToApp sx={{ fontSize: 22, color: "#f44336" }} /> </ListItemIcon>
                        <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

    
      <Box component="nav">
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 280, 
                    borderTopRightRadius: 16, 
                    borderBottomRightRadius: 16
                },
            }}
        >
            {drawerContent}
        </Drawer>
      </Box>

     
      <Dialog
        open={openPwdDialog}
        onClose={() => setOpenPwdDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center", background: currentUser?.role === 'ADMIN' ? "linear-gradient(135deg, #f44336 0%, #e57373 100%)" : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)", color: "#fff", py: 2.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Lock /> Đổi mật khẩu
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
            <TextField label="Mật khẩu hiện tại" type="password" value={pwd.old} onChange={(e) => setPwd({ ...pwd, old: e.target.value })} fullWidth variant="outlined" />
            <TextField label="Mật khẩu mới" type="password" value={pwd.new1} onChange={(e) => setPwd({ ...pwd, new1: e.target.value })} fullWidth variant="outlined" />
            <TextField label="Nhập lại mật khẩu mới" type="password" value={pwd.new2} onChange={(e) => setPwd({ ...pwd, new2: e.target.value })} fullWidth variant="outlined" />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2, px: 3 }}>
          <Button variant="outlined" onClick={() => setOpenPwdDialog(false)} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3, py: 1 }}>Hủy</Button>
          <Button variant="contained" onClick={handleSavePassword} sx={{ background: currentUser?.role === 'ADMIN' ? "linear-gradient(90deg, #f44336 0%, #e57373 100%)" : "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)", textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3, py: 1 }}>Cập nhật mật khẩu</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;