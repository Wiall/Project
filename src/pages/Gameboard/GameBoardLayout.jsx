import React from "react";
import "./styles.css"
import GameBoardRoma from "../../components/GameBoardRoma";
import './CardGame.css';

function GameBoardLayout() {
    return (
      <div className="game-page">
        <div className="app">
          <header className="header">
          </header>
          <GameBoardRoma />
    
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