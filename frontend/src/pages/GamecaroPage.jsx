import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoom, joinRoom } from "../services/gamecaroService";

const GameCaroPage = () => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async () => {
    try {
      toast.info("🔄 Đang tạo phòng...");
      const room = await createRoom();
      toast.success(`✅ Tạo phòng thành công! ID: ${room._id}`);
      setTimeout(
        () => navigate(`/caro-room/${room._id}`, { state: { room } }),
        2000
      );
    } catch (error) {
      toast.error(`❌ Lỗi khi tạo phòng: ${error.message}`);
    }
  };

  const handleFindRoom = async () => {
    if (isJoining) return;
    setIsJoining(true);
    toast.info("🔍 Đang tìm phòng...");
    try {
      const room = await joinRoom();
      if (!room) {
        toast.warning("⚠️ Không tìm thấy phòng trống!");
        return;
      }
      toast.success(`✅ Đã tham gia phòng: ${room._id}`);
      navigate(`/caro-room/${room._id}`, { state: { room } });
    } catch (error) {
      toast.error(`❌ Không thể tìm phòng: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2000} />

      <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
        ⬅️ Quay lại
      </button>

      <h1 style={styles.title}>Game Cờ Caro</h1>

      <div style={styles.buttonContainer}>
        <button onClick={handleCreateRoom} style={styles.button}>
          🏠 Tạo phòng
        </button>
        <button
          onClick={handleFindRoom}
          style={styles.button}
          disabled={isJoining}
        >
          {isJoining ? "🔄 Đang tìm phòng..." : "🔍 Tìm phòng"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    transition: "0.3s",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#6c757d",
    color: "white",
    transition: "0.3s",
  },
};

export default GameCaroPage;
