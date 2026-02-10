import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Container,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { Lock, Security, Key } from "@mui/icons-material";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function ChangePasswordPage() {
  useScrollToTop();
  const [pwd, setPwd] = useState({ old: "", new1: "", new2: "" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleChangePwd = () => {
    if (!pwd.old || !pwd.new1 || !pwd.new2) {
      setSnack({ open: true, message: "Vui lòng điền đầy đủ thông tin!", severity: "warning" });
      return;
    }
    
    if (pwd.new1 !== pwd.new2) {
      setSnack({ open: true, message: "Mật khẩu mới không khớp!", severity: "error" });
      return;
    }
    
    if (pwd.new1.length < 6) {
      setSnack({ open: true, message: "Mật khẩu phải có ít nhất 6 ký tự!", severity: "error" });
      return;
    }
    
    setSnack({ open: true, message: "Đổi mật khẩu thành công!", severity: "success" });
    setPwd({ old: "", new1: "", new2: "" });
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 8,
        display: "flex",
        alignItems: "center"
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #FF6B6B 0%, #FF8E53 100%)",
              mb: 3,
              boxShadow: "0 8px 25px rgba(255,107,107,0.3)"
            }}
          >
            <Security sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              color: "white", 
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            Đổi Mật Khẩu
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              color: "rgba(255,255,255,0.8)",
              fontSize: "16px"
            }}
          >
            Bảo vệ tài khoản của bạn với mật khẩu mới
          </Typography>
        </Box>

        {/* Password Form Card */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Current Password */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="600" 
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Mật khẩu hiện tại
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập mật khẩu hiện tại"
                  type="password"
                  value={pwd.old}
                  onChange={(e) => setPwd({ ...pwd, old: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f9fa",
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* New Password */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="600" 
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Mật khẩu mới
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập mật khẩu mới"
                  type="password"
                  value={pwd.new1}
                  onChange={(e) => setPwd({ ...pwd, new1: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f9fa",
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </Box>

              {/* Confirm New Password */}
              <Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="600" 
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Nhập lại mật khẩu mới
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Xác nhận mật khẩu mới"
                  type="password"
                  value={pwd.new2}
                  onChange={(e) => setPwd({ ...pwd, new2: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "#f8f9fa",
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setPwd({ old: "", new1: "", new2: "" })}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: "#ddd",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "#999",
                      backgroundColor: "rgba(0,0,0,0.02)"
                    }
                  }}
                >
                  Hủy
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Key />}
                  onClick={handleChangePwd}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
                      background: "linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)",
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  Cập nhật mật khẩu
                </Button>
              </Box>

              {/* Password Requirements */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  💡 Mật khẩu nên có ít nhất 6 ký tự, bao gồm chữ và số
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Snackbar Notification */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert 
            severity={snack.severity} 
            onClose={handleCloseSnack}
            sx={{ 
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}