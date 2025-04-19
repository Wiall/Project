import React from "react";
// import GameBoard from "./components/GameBoard";
import GameBoard from "./components/GameBoardRoma";
import "./styles/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import GameBoardLayout from "./pages/Gameboard/GameBoardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameBoardLayout />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;