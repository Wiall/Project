import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GameBoard from "./components/GameBoard";
import About from "./pages/About";
import "./styles/styles.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
        </header>

        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <footer className="footer">
        <nav>
            <Link to="/" className="nav-link">Main</Link>
            <br/>
            <Link to="/about" className="nav-link">© 2025 Echowisp Studio</Link>
          </nav>
          </footer>
      </div>
    </Router>
  );
}

export default App;
