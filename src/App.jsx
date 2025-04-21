import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import GameBoardLayout from "./pages/Gameboard/GameBoardLayout";
import Home from "./pages/Home/Home";
import PlayerHomePage from "./pages/PlayerHub/PlayerHomePage";
import DeckBuilderPage from "./pages/DeckBuilderPage/DeckBuilderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/game-room" element={<GameBoardLayout />} />
        <Route path="/game-page" element={<PlayerHomePage />} />
        <Route path="/game-deck" element={<DeckBuilderPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;