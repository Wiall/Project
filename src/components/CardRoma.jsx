import React from "react";

export default function CardRoma({ card, onClick }) {
  const isHidden = card.isHidden;
  const imageUrl = isHidden
    ? "public/sprites/card-back.png" // 🂠 Зображення сорочки карти
    : "echoes-of-darkness-backend/" +
      (card.fullData?.imageUrl ?? "placeholder.png");

  return (
    <div
      className={`cardd ${card.isAiCard ? "ai-card" : ""} ${card.id} ${
        isHidden ? "hidden" : ""
      }`}
      onClick={() => !isHidden && onClick?.(card)} // 🔒 Не дозволяти клік, якщо карта прихована
      style={{ cursor: isHidden ? "default" : "pointer" }}
    >
      <img src={imageUrl} alt={card.content} />
      {!isHidden && (
        <>
          <span className="stat-1">{card.hp}</span>
          <span className="stat-2">{card.attack}</span>
        </>
      )}
    </div>
  );
}
