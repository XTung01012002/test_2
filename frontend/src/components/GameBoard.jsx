import React, { useEffect, useState } from "react";
import {
  startGame,
  getGame,
  moveBall,
  generateBall,
  assistMove,
} from "../services/gameService";
import "./GameBoard.css";

const COLORS = [
  "",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
];

const GameBoard = () => {
  const [board, setBoard] = useState(() =>
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [selected, setSelected] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false); // Thêm trạng thái kết thúc game

  // Hàm khởi động hoặc chơi lại game
  const initializeGame = async () => {
    try {
      const data = await startGame();
      console.log("🚀 Game bắt đầu:", data);
      setGameId(data._id);
      setIsGameOver(false); // Reset trạng thái game
      setMessage("");
      await updateBoard(data._id);
    } catch (error) {
      console.error("❌ Lỗi khi khởi động game:", error);
      setMessage("Lỗi khi khởi động game!");
    }
  };

  // Cập nhật bảng từ server
  const updateBoard = async (id) => {
    try {
      const data = await getGame(id);
      setBoard(data.board);
      setIsGameOver(data.isGameOver); // Cập nhật trạng thái game
      if (data.isGameOver) {
        setMessage('🎮 Game Over! Ấn "🔄 Chơi lại" để bắt đầu lại.');
      }
    } catch (error) {
      setMessage("Lỗi khi lấy dữ liệu game!");
    }
  };

  const handleCellClick = async (x, y) => {
    if (!gameId || isGameOver) return;
    if (selected) {
      if (board[y][x] === 0) {
        try {
          await moveBall(gameId, {
            x1: Number(selected.x),
            y1: Number(selected.y),
            x2: Number(x),
            y2: Number(y),
          });
          await generateBall(gameId);
          await updateBoard(gameId);
        } catch (error) {
          setMessage("❌ Không thể di chuyển bóng!");
        }
      }
      setSelected(null);
    } else {
      if (board[y][x] !== 0) {
        setSelected({ x, y });
      }
    }
  };

  // Xử lý khi ấn nút trợ giúp
  const handleAssistMove = async () => {
    if (!gameId || isGameOver) return;
    try {
      const data = await assistMove(gameId);
      setBoard(data.board);
      setMessage("💡 Đã di chuyển bóng tối ưu!");
      if (data.isGameOver) {
        setMessage("🎮 Game Over!");
        setIsGameOver(true);
      }
    } catch (error) {
      setMessage("❌ Không có nước đi hợp lệ!");
    }
  };

  return (
    <div className="game-container">
      {/* Nhóm nút điều khiển */}
      <div className="button-group">
        <button onClick={initializeGame} className="start-button">
          {isGameOver ? "🔄 Chơi lại" : "🎮 Bắt đầu"}
        </button>
        <button onClick={handleAssistMove} className="assist-button" disabled={isGameOver}>
          🤖 Trợ giúp
        </button>
      </div>
  
      {/* Hiển thị thông báo */}
      {message && <div className="message">{message}</div>}
  
      {/* Bàn cờ game */}
      <div className="game-board">
        {board.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell ${selected?.x === x && selected?.y === y ? "selected" : ""}`}
                onClick={() => handleCellClick(x, y)}
              >
                {cell !== 0 && (
                  <div
                    className="ball-animation"
                    style={{ backgroundColor: COLORS[cell] }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}  
export default GameBoard;
