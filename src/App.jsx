import './index.css'

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
import { AuthProvider } from "./providers/AuthProvider";
import { PrivateRoute } from "./components/Auth/PrivateRoute";



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/game-room" element={
            <PrivateRoute>
              <GameBoardLayout />
            </PrivateRoute>
          } />
          <Route path="/game-page" element={
            <PrivateRoute>
              <PlayerHomePage />
            </PrivateRoute>
          } />
          <Route path="/game-deck" element={
            <PrivateRoute>
              <DeckBuilderPage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path="/shop" element={
            <PrivateRoute>
              <ShopPage />
            </PrivateRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;