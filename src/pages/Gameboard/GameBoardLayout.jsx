import React from "react";
import "./styles.css"
import GameBoard from "../../components/GameBoard";
function GameBoardLayout() {
    return (
      <div className="game-page">
        <div className="app">
          <header className="header">
          </header>
          <GameBoard />
    
          <footer className="footer">
            <nav>
              <a href="/" className="nav-link">Main</a>
              <br />
              <a href="/about" className="nav-link">© 2025 Echowisp Studio</a>
            </nav>
          </footer>
        </div>
      </div>
    );
  }
export default GameBoardLayout;