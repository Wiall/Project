import React from "react";
import CardRoma from "./CardRoma";

export default function HandAI({ aiHand, disappearingCardId, onCardClick }) {
  return (
    <div
      className="ai-hand-zone"
      style={{ display: "flex", justifyContent: "center", gap: "10px" }}
    >
      <div className="ai-hand-container" style={{ display: "flex" }}>
        {aiHand.map((card) => (
          <CardRoma
            key={card.id}
            card={card}
            onClick={onCardClick}
            isDisappearing={disappearingCardId === card.id}
          />
        ))}
      </div>
    </div>
  );
}
