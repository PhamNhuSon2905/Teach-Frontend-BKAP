import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Xanh chính (Aptech Blue)
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#ff9800", // Cam phụ (Aptech Orange)
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#0d1b2a",
      secondary: "#546e7a",
    },
  },

  typography: {
    fontFamily: "'Montserrat', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 900, letterSpacing: "-0.5px" },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: "none" },
  },

  shape: { borderRadius: 16 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          fontWeight: 700,
          textTransform: "none",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#0d1b2a",
        },
      },
    },
  },
});

export default theme;
