import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="player-header">
      <Link to="/game-page" className="logo">
        Echoes of Darkness
      </Link>
      <nav className="menu">
        <NavLink to="/profile" className="menu-link">
          <button>Profile</button>
        </NavLink>
        <NavLink to="/game-deck" className="menu-link">
          <button>Deck</button>
        </NavLink>
        <NavLink to="/game-room" className="menu-link">
          <button>Play</button>
        </NavLink>
        <NavLink to="/shop" className="menu-link">
          <button>Shop</button>
        </NavLink>
      </nav>
    </header>
);
}
