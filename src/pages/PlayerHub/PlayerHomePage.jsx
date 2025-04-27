// src/pages/PlayerHomePage.jsx
import React from "react";
import "./PlayerHomePage.css";
import { Link } from "react-router-dom";

export default function PlayerHomePage() {
  return (
    <div className="player-home">
      <header className="player-header">
        <div className="logo">Echoes of Darkness</div>
        <nav className="menu">
          <Link to="/profile"><button>Profile</button></Link>
          <Link to="/game-deck"><button>Deck</button></Link>
          <Link to="/game-room"><button>Play</button></Link>
          <Link to="/shop"><button>Shop</button></Link>
        </nav>
      </header>

      <main className="player-content two-column-layout">
        <div className="left-column">
          <section className="profile-block">
            <img src="/sprites/artur.jpg" alt="Your avatar" />
            <div>
              <h3>Rookmaster</h3>
              <p>Level 17 Ranger</p>
              <p>Rank: Platinum</p>
            </div>
          </section>

          <section className="welcome-block">
            <h3>Welcome back, Adventurer!</h3>
            <p>Your journey awaits. Prepare your deck and enter the darkness...</p>
          </section>
        </div>

        <div className="right-column">
          <section className="news-block">
            <h2>News & Updates</h2>
            <ul>
              <li>🔥 New Season begins May 1st!</li>
              <li>🃏 Legendary Card Pack now available</li>
              <li>⚔️ Ranked mode patch 1.2.4 deployed</li>
            </ul>
          </section>

          <section className="season-block">
            <h2>Season Progress</h2>
            <p>🌒 The Eclipse War</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: "45%" }}></div>
            </div>
            <p>Level 12 of 30</p>
          </section>

          <section className="daily-reward">
            <h2>🎁 Daily Reward</h2>
            <p>Login 3 days in a row to claim a Rare Pack!</p>
            <button>Claim Reward</button>
          </section>
        </div>
      </main>

      <footer className="player-footer">
        <p>
          Learn more <Link to="/about">about the world</Link>
        </p>
      </footer>
    </div>
  );
}
