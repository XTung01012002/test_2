import React from "react";
import { useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";

const GamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅ Quay lại
      </button>
      <GameBoard />
    </div>
  );
};

export default GamePage;
