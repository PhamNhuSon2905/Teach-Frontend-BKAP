import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SendIcon from "@mui/icons-material/Send";
import { useScrollToTop } from "../hooks/useScrollToTop";


export default function ContactPage() {
  useScrollToTop();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert("✅ Gửi liên hệ thành công!");
  };

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
      
        py: { xs: 6, md: 12 },
        fontFamily: "'Montserrat', sans-serif",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
  
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="flex-start">
          
          {/* ==== LEFT: Contact Info ==== */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                mb: 4,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: { xs: "1.75rem", md: "2.125rem" }, // Chữ nhỏ hơn chút trên mobile
              }}
            >
              Liên hệ
            </Typography>

            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <RoomIcon sx={{ color: "primary.main", mt: "4px" }} />
                <Typography sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
                  <b>Địa chỉ:</b> Tòa nhà Bách Khoa Aptech, 236 Hoàng Quốc Việt,
                  Cổ Nhuế, Bắc Từ Liêm, Hà Nội
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <PhoneIcon sx={{ color: "primary.main" }} />
                <Typography sx={{ fontSize: "1rem" }}>
                  <b>Tel:</b> 01234 567 890
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <LocalPhoneIcon sx={{ color: "primary.main" }} />
                <Typography sx={{ fontSize: "1rem" }}>
                  <b>Hotline:</b> 0123 456 789
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <EmailIcon sx={{ color: "primary.main" }} />
                <Typography sx={{ fontSize: "1rem" }}>
                  <b>Email:</b> info@aptech.vn
                </Typography>
              </Stack>
            </Stack>
          </Grid>

   
          <Grid item xs={12} md={7}>
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 5 }, 
                borderRadius: 4,
                backgroundColor: "#fafafa",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    type="tel"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Lời nhắn"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
           
                    fullWidth 
                    sx={{
                      width: { xs: "100%", md: "auto" }, 
                      alignSelf: { xs: "stretch", md: "flex-end" },
                      px: 6,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                      boxShadow: "0 6px 20px rgba(25,118,210,0.25)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Gửi liên hệ
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>


        <Box
          sx={{
            mt: { xs: 6, md: 10 }, 
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
            height: { xs: "300px", md: "450px" } 
          }}
        >
          <iframe
            title="Bach Khoa Aptech Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.657325700816!2d105.78126231540253!3d21.04639359255227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab32dd484c53%3A0x4201b89c8bdfd968!2zMjM4IEhvw6BuZyBRdeG7kWMgVmnhu4d0LCBD4buWIE5odeG6vywgQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1646816432000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Container>

   
      <IconButton
        href="tel:0382020858"
        sx={{
          position: "fixed",
          bottom: { xs: 24, md: 40 }, 
          right: { xs: 24, md: 40 },  
          backgroundColor: "#d50000",
          color: "#fff",
          width: { xs: 50, md: 60 },   
          height: { xs: 50, md: 60 },
          boxShadow: "0 8px 25px rgba(213,0,0,0.3)",
          zIndex: 1000,
          "&:hover": {
            backgroundColor: "#ff1744",
            transform: "scale(1.05)",
          },
        }}
      >
        <PhoneIcon fontSize="medium" />
      </IconButton>
    </Box>
  );
}