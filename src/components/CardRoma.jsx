import React from "react";

export default function CardRoma({ card, onClick }) {
  const imageUrl =
    "echoes-of-darkness-backend/" + card.fullData?.imageUrl ??
    "/placeholder.png"; // ! адреса тимчасова

  return (
    <div
      className={`cardd ${card.isAiCard ? "ai-card" : ""} ${card.id} ${
        card.isHidden ? "hidden" : ""
      }`}
      onClick={() => onClick?.(card)}
      style={{ cursor: "pointer" }}
    >
      <img src={imageUrl} alt={card.content} />
      <span className="stat-1">{card.hp}</span>
      <span className="stat-2">{card.attack}</span>
    </div>
  );
}
