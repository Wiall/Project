import React, { useState } from "react";
import Deck from "./Deck";
import Hand from "./Hand";

function GameBoard() {
  const [handCards, setHandCards] = useState([
    { id: 1, title: "Card 1" },
    { id: 2, title: "Card 2" },
    { id: 3, title: "Card 3" },
    { id: 4, title: "Card 4" },
    { id: 5, title: "Card 5" },
  ]);
  const [playedCards, setPlayedCards] = useState([]);

  const handlePlayCard = (card) => {
    setPlayedCards([...playedCards, card]);
    setHandCards(handCards.filter((c) => c.id !== card.id));
  };

  return (
    <div className="game-board">
      <Deck />
      <Hand cards={handCards} onPlayCard={handlePlayCard} />
      <div className="played-zone">
        {playedCards.map((card) => (
          <div key={card.id} className="played-card">
            {card.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
