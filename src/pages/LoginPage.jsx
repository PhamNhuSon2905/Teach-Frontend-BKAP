import React, { useState } from "react";
import { useScrollToTop } from "../hooks/useScrollToTop";
import authApi from "../api/authApi";
import { toast } from "../ui/toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function LoginPage({ onClose }) {
  
  const { loginUser } = useContext(AuthContext); 
  useScrollToTop();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

     if (!formData.username || !formData.password) {
      toast.warning("Vui lòng nhập đầy đủ tài khoản và mật khẩu !");
      return;
    }

    try {
      setLoading(true);

      const res = await authApi.login(formData);
      const result = res.data;

      if (!result.success) {
        toast.error("Đăng nhập thất bại");
        return;
      }

    
      const userData = {
        id: result.data.id,
        username: result.data.username,
        fullname: result.data.fullname,
        role: result.data.role,
        avatar : result.data.avatar,
      };

      loginUser({
      token: result.data.token,
      user: userData
    });

        toast.success(`Đăng nhập thành công ! Chào mừng giảng viên ${userData.fullname}`);

      window.dispatchEvent(
        new CustomEvent("userLoginSuccess", { detail: userData })
      );

      if (onClose) onClose();
    } catch (err) {
       toast.error("Tên người dùng hoặc mật khẩu không chính xác !");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    modalHeader: {
      textAlign: "center",
      marginBottom: "28px",
    },
    modalTitle: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#000000",
      marginBottom: "8px",
      letterSpacing: "-0.5px",
    },
    modalSubtitle: {
      fontSize: "15px",
      fontWeight: 400,
      color: "#666666",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    fieldWrapper: {
      marginBottom: "4px",
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: 500,
      color: "#333333",
      marginBottom: "8px",
      display: "block",
    },
    inputField: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #D1D5DB",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      backgroundColor: "#FFFFFF",
      color: "#000000",
    },
    submitButton: {
      backgroundColor: loading ? "#9ca3af" : "#2563EB",
      color: "#FFFFFF",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "15px",
      marginTop: "8px",
      minHeight: "44px",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "14px",
      fontWeight: 500,
      marginTop: "4px",
    },
  };

  return (
    <div>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>BKAP</h2>
        <p style={styles.modalSubtitle}>Đăng nhập vào hệ thống BKAP</p>
      </div>

      <form style={styles.formContainer} onSubmit={handleSubmit}>
        <div style={styles.fieldWrapper}>
          <label style={styles.inputLabel}>Tên người dùng</label>
          <input
            style={styles.inputField}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tên người dùng"
            disabled={loading}
          />
        </div>

        <div style={styles.fieldWrapper}>
          <label style={styles.inputLabel}>Mật khẩu</label>
          <input
            style={styles.inputField}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            disabled={loading}
          />
        </div>

        {error && <div style={styles.errorText}>{error}</div>}

        <button type="submit" style={styles.submitButton}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
