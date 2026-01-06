import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ToastProvider from "./ui/ToastProvider";
import InstructorLessonsPage from "./pages/instructor/InstructorLessonsPage";
import InstructorLessonDetailsPage from "./pages/instructor/InstructorLessonsDetailsPage";
import { AuthProvider } from "./context/AuthContext";





function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider> 
        <Router>
          <Routes>
            <Route path="/" element={<Layout setShowLogin={setShowLogin} />}>
              <Route index element={<HomePage setShowLogin={setShowLogin} />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* ===== TEACHER – PROTECTED ===== */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/teacher/lessons"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <InstructorLessonsPage />
                  </Layout>
                }
              />

              <Route
                path="/teacher/lessons/:id"
                element={
                  <Layout setShowLogin={setShowLogin}>
                    <InstructorLessonDetailsPage />
                  </Layout>
                }
              />
            </Route>


            {/* ===== PROFILE ===== */}
            <Route
              path="/profile"
              element={
                <Layout setShowLogin={setShowLogin}>
                  <ProfilePage />
                </Layout>
              }
            />

            {/* ===== NOT FOUND ===== */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* ===== LOGIN POPUP ===== */}
          {showLogin && (
            <div style={overlayStyle} onClick={() => setShowLogin(false)}>
              <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowLogin(false)}
                  style={closeButtonStyle}
                >
                  ×
                </button>
                <LoginPage onClose={() => setShowLogin(false)} />
              </div>
            </div>
          )}
        </Router>
        </AuthProvider> 
      </ToastProvider>

    </ThemeProvider>
  );
}

/* ===== POPUP LOGIN STYLE ===== */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  backgroundColor: "#FFFEF5",
  borderRadius: "32px",
  padding: "32px 28px",
  width: "100%",
  maxWidth: "360px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "none",
  border: "none",
  fontSize: "24px",
  color: "#6B7280",
  cursor: "pointer",
};

export default App;
