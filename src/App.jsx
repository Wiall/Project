import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import GameBoardLayout from "./pages/Gameboard/GameBoardLayout";
import Home from "./pages/Home/Home";
import PlayerHomePage from "./pages/PlayerHub/PlayerHomePage";
import DeckBuilderPage from "./pages/DeckBuilderPage/DeckBuilderPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ShopPage from "./pages/Shop/ShopPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/Auth/ResetPasswordPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/game-room" element={<GameBoardLayout />} />
        <Route path="/game-page" element={<PlayerHomePage />} />
        <Route path="/game-deck" element={<DeckBuilderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;