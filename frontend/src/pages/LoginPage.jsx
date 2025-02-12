import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.warn("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await login(username, password);
      toast.success("✅ Đăng nhập thành công!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Đăng nhập thất bại!");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Nhập password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Đăng nhập
        </button>

        <p className="text-center mt-3">
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
