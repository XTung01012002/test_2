import { useNavigate } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h2 className="mb-4">Trang chủ</h2>

        {/* Nút thay đổi thông tin tài khoản */}
        <button
          className="btn btn-warning w-100 mb-2"
          onClick={() => navigate("/profile")}
        >
          Thay đổi thông tin
        </button>

        {/* Nút chọn trò chơi */}
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate("/line98")}
          >
            Line 98
          </button>
          <button
            className="btn btn-success w-100"
            onClick={() => navigate("/caro")}
          >
            Cờ Caro X O
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
