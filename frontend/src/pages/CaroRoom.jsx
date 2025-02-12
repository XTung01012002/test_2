import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./css/CaroRoom.css";

const socket = io("http://localhost:8088");

const CaroRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [board, setBoard] = useState(
    Array(15)
      .fill()
      .map(() => Array(15).fill(""))
  );
  const [currentUser, setCurrentUser] = useState("");
  const [gameStatus, setGameStatus] = useState("waiting");
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;

    const room = location.state?.room;
    if (room) {
      setPlayer1(room.playerX);
      setPlayer2(room.playerO || "Đang chờ...");
      setGameStatus(room.status);
      let user = !room.playerO ? room.playerX : room.playerO;
      setCurrentUser(user);
      socket.emit("joinRoom", { roomId, username: user });
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      if (data.roomId === roomId) {
        setPlayer1(data.playerX);
        setPlayer2(data.playerO);
        setGameStatus(data.status);
        if (data.board) {
          setBoard(data.board);
        }
      }
    });

    socket.on("updateRoomStatus", (data) => {
      if (data.roomId === roomId) {
        setGameStatus(data.status);
        if (data.board) {
          setBoard(data.board);
        }
      }
    });

    socket.on("gameUpdate", (data) => {
      setBoard(data.board);
      setCurrentTurn(data.nextTurn);
      setIsProcessingMove(false);
    });

    socket.on("gameOver", (data) => {
      setGameStatus("finished");
      setWinner(data.winner);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("updateRoomStatus");
      socket.off("gameUpdate");
      socket.off("gameOver");
    };
  }, [roomId]);

  const handleStartGame = () => {
    if (currentUser === player1) {
      socket.emit("startGame", { roomId });
      setGameStatus("playing");
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (gameStatus !== "playing" || board[rowIndex][colIndex] !== "" || isProcessingMove) return;
    if (currentUser !== (currentTurn === "X" ? player1 : player2)) return;
    
    setIsProcessingMove(true);
    console.log("📤 Gửi nước đi lên server:", { roomId, player: currentTurn, x: colIndex, y: rowIndex });

    socket.emit("move", { roomId, player: currentTurn, x: colIndex, y: rowIndex });
    
    socket.once("gameUpdate", () => setIsProcessingMove(false));
    socket.once("moveError", () => setIsProcessingMove(false));
  };

  return (
    <div className="room-container">
      <h2 className="room-title">♟️ Phòng chơi: {roomId}</h2>
      {gameStatus === "playing" && <h3 className="game-status">Game bắt đầu!</h3>}
      {gameStatus === "finished" && (
        <h3 className="game-status winner-message">🏆 Trò chơi kết thúc! Người thắng: {winner}</h3>
      )}

      <div className="game-area">
        <div className="player player-left">
          <span className="player-icon green">●</span>
          <h3 className="player-name">Người chơi 1 (X): {player1} {currentUser === player1 && "(Bạn)"}</h3>
        </div>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="cell" onClick={() => handleCellClick(rowIndex, colIndex)}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="player player-right">
          <span className="player-icon blue">●</span>
          <h3 className="player-name">Người chơi 2 (O): {player2} {currentUser === player2 && "(Bạn)"}</h3>
        </div>
      </div>

      {gameStatus === "ready" && currentUser === player1 && (
        <button className="start-button" onClick={handleStartGame}>Bắt đầu trò chơi</button>
      )}
    </div>
  );
};

export default CaroRoom;