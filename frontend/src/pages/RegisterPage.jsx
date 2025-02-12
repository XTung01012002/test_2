import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !email || !nickname || !age) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin!", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (age <= 0) {
      toast.error("⚠️ Tuổi phải lớn hơn 0!", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      await register(username, password, email, nickname, Number(age));
      toast.success("🎉 Đăng ký thành công!", { position: "top-right", autoClose: 2000 });
      
      // Chờ 2 giây trước khi chuyển hướng
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(`❌ ${error.response?.data?.message || "Đăng ký thất bại!"}`, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer /> {/* Đảm bảo hiển thị thông báo */}
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng ký</h2>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" placeholder="Nhập username"
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Nhập password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Nhập email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Nickname</label>
          <input type="text" className="form-control" placeholder="Nhập nickname"
            value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input type="number" className="form-control" placeholder="Nhập tuổi"
            value={age} onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0 || e.target.value === "") setAge(e.target.value);
            }} />
        </div>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Đăng ký
        </button>

        <p className="text-center mt-3">
          Đã có tài khoản? <a href="/">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
