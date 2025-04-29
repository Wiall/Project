import React from "react";
import "./Home.css";
import Stars from "../../components/Stars";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Stars />
      <div className="overlay">
        <header className="hero">
          <h1 className="title-glow">Echoes of Darkness</h1>
          <p className="text-fade ">Forge your destiny in a world where magic meets shadows.</p>
          <button className="cta-button" onClick={() => navigate("/game-page")}>
            Enter the Realm
          </button>
        </header>
      </div>
    </div>
  );
}
