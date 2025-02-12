import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import GamePage from "./pages/GamePage";
import GameCaroPage from "./pages/GamecaroPage";
 import CaroRoom from "./pages/CaroRoom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/caro-room/:roomId" element={<CaroRoom />} />
        <Route path="/caro" element={<GameCaroPage />} />
        <Route path="/line98" element={<GamePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
