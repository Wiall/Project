import React from "react";
export default function CardRoma({ card, onClick }) {
  return (
    <div
      className={`cardd ${card.isAiCard ? "ai-card" : ""} ${card.id} ${
        card.isHidden ? "hidden" : ""
      }`}
      onClick={() => onClick?.(card)}
      style={{ cursor: "pointer" }}
    >
      <img src={`${card.content}.png`} alt="" />
      <span className="stat-1">10</span>
      <span className="stat-2">10</span>
    </div>
  );
}
