import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Səhifə yüklənəndə inputları təmizlə və localStorage-ı yoxla
  useEffect(() => {
    setEmail("");
    setPassword("");
    // Əgər artıq login olunubsa, dashboard-a yönləndir
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasiya
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin/dashboard"); // DƏYİŞDİ: /admin əvəzinə /admin/dashboard
    } else {
      setError("Email və ya şifrə yanlışdır!");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Admin Panel</h1>
        <p className="login-subtitle">Daxil olmaq üçün məlumatlarınızı daxil edin</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-poçt ünvanınızı daxil edin"
              className="input-field"
              required
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrənizi daxil edin"
              className="input-field"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="login-button">
            Daxil ol
          </button>
        </form>

        {/* Test məlumatı */}
        <div className="login-hint">
          <p>Test: admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;