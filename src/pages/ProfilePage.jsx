import React, { useState, useRef, useEffect, useContext } from "react";
import profileApi from "../api/profileApi";
import { buildFileUrl } from "../utils/fileUrl";
import { AuthContext } from "../context/AuthContext";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { toast } from "../ui/toast";

// MUI Components
import {
  Box,
  Grid,
  Card,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Container,
  InputAdornment
} from "@mui/material";

// Icons
import {
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from "@mui/icons-material";

export default function ProfilePage() {
  useScrollToTop();
  const { updateUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    avatarPreview: "",
    avatarFile: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileApi.getMe();
        const p = res.data.data;
        updateUser(p);

        setForm({
          fullname: p.fullname || "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address || "",
          avatarPreview: buildFileUrl(p.avatar),
          avatarFile: null,
        });
      } catch (e) {
        if (e.response?.status !== 401) {
          toast.error("Không tải được thông tin hồ sơ");
        }
      }
    };
    loadProfile();
  }, []);


  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleAvatarClick = () => {
    if (isEditing) {
       fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((s) => ({
      ...s,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              fullname: form.fullname,
              email: form.email,
              phone: form.phone,
              address: form.address,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (form.avatarFile) {
        fd.append("avatar", form.avatarFile);
      }

      const res = await profileApi.updateProfile(fd);
      const updated = res.data.data;
      updateUser(updated);

      setForm({
        fullname: updated.fullname,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        avatarPreview: buildFileUrl(updated.avatar),
        avatarFile: null,
      });

      toast.success("Cập nhật hồ sơ thành công");
      setIsEditing(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        
        background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)",
        py: { xs: 4, md: 8 },
        px: 2
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          
      
          <Grid item xs={12} md={4}>
            <Card 
                sx={{ 
                    borderRadius: 4, 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)", 
                    textAlign: "center", 
                    p: 4,
                    height: '100%' 
                }}
            >
              <Box 
                sx={{ 
                  position: "relative", 
                  width: 140, 
                  height: 140, 
                  mx: "auto", 
                  mb: 3,
                  cursor: isEditing ? "pointer" : "default" 
                }}
                onClick={handleAvatarClick}
              >
                <Avatar
                  src={form.avatarPreview}
                  alt={form.fullname}
                  sx={{ width: "100%", height: "100%", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                
            
                {isEditing && (
                   <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 1 }
                    }}
                   >
                     <CameraIcon sx={{ color: "#fff", fontSize: 32 }} />
                   </Box>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>{form.fullname}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{form.email}</Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Stack spacing={2} alignItems="flex-start" sx={{ px: 1 }}>
                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <PhoneIcon color="action" />
                    <Typography variant="body1">{form.phone || "Chưa cập nhật SĐT"}</Typography>
                 </Box>
                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <LocationIcon color="action" />
                    <Typography variant="body1" sx={{ textAlign: 'left' }}>{form.address || "Chưa cập nhật địa chỉ"}</Typography>
                 </Box>
              </Stack>
            </Card>
          </Grid>


          <Grid item xs={12} md={8}>
            <Card 
                sx={{ 
                    borderRadius: 4, 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)", 
                    p: { xs: 3, md: 4 }, 
                    height: '100%' 
                }}
            >
              
              {/* HEADER */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                 <Typography variant="h5" fontWeight="bold">Thông tin cá nhân</Typography>
                 <Button
                    variant={isEditing ? "outlined" : "contained"}
                    color={isEditing ? "error" : "primary"}
                    startIcon={isEditing ? <CloseIcon /> : <EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{ 
                        borderRadius: 2, 
                        textTransform: "none", 
                        fontWeight: 600,
                        bgcolor: !isEditing ? "#4f46e5" : "transparent", 
                        "&:hover": { bgcolor: !isEditing ? "#4338ca" : "rgba(211, 47, 47, 0.04)" }
                    }}
                 >
                    {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
                 </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   <TextField
                      fullWidth
                      label="Họ và tên"
                      value={form.fullname}
                      onChange={onChange("fullname")}
                      disabled={!isEditing}
                      InputProps={{
                         startAdornment: (
                            <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>
                         ),
                      }}
                      variant="outlined"
                   />
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField
                      fullWidth
                      label="Email"
                      value={form.email}
                      disabled 
                      InputProps={{
                         startAdornment: (
                            <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>
                         ),
                      }}
                      variant="filled" 
                   />
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={form.phone}
                      onChange={onChange("phone")}
                      disabled={!isEditing}
                      InputProps={{
                         startAdornment: (
                            <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>
                         ),
                      }}
                   />
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField
                      fullWidth
                      label="Địa chỉ"
                      value={form.address}
                      onChange={onChange("address")}
                      disabled={!isEditing}
                      InputProps={{
                         startAdornment: (
                            <InputAdornment position="start"><LocationIcon color="action" /></InputAdornment>
                         ),
                      }}
                   />
                </Grid>
              </Grid>

      
              {isEditing && (
                 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                    <Button 
                       variant="outlined" 
                       color="inherit" 
                       onClick={() => setIsEditing(false)}
                       sx={{ borderRadius: 2, px: 4 }}
                    >
                       Hủy
                    </Button>
                    <Button 
                       variant="contained" 
                       onClick={handleSave}
                       startIcon={<SaveIcon />}
                       sx={{ 
                           borderRadius: 2, 
                           px: 4, 
                           bgcolor: "#4f46e5", 
                           "&:hover": { bgcolor: "#4338ca" }
                        }}
                    >
                       Lưu thay đổi
                    </Button>
                 </Box>
              )}
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}