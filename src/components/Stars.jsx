// src/components/Stars.jsx
import React from "react";
import "./Stars.css";

export default function Stars() {
  const starsFast = Array.from({ length: 60 }, (_, i) => (
    <div key={`f-${i}`} className="star fast" style={randomStyle(true)}></div>
  ));
  const starsSlow = Array.from({ length: 40 }, (_, i) => (
    <div key={`s-${i}`} className="star slow" style={randomStyle(false)}></div>
  ));

  return (
    <div className="stars-container">
      {[...starsFast, ...starsSlow]}
      <div className="comet"></div>
    </div>
  );
}

function randomStyle(isFast) {
  const size = Math.random() * 2 + 1; // 1–3px
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 10;
  const moveX = Math.random() * (isFast ? 10 : 3) - (isFast ? 5 : 1.5); // -5 to 5 px or -1.5 to 1.5
  const moveY = Math.random() * (isFast ? 10 : 3) - (isFast ? 5 : 1.5);

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    '--move-x': `${moveX}px`,
    '--move-y': `${moveY}px`
  };
}