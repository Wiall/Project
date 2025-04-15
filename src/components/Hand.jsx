import React, { useState, useEffect } from "react";

const Hand = ({ cards, onPlayCard }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("card-preview-overlay")) {
      setSelectedCard(null); // повернути в руку
    }
  };

  useEffect(() => {
    if (selectedCard) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedCard]);

  const handlePlayCard = () => {
    onPlayCard(selectedCard);
    setSelectedCard(null);
  };

  const total = cards.length;
  const maxAngle = 80;
  const angleStep = total > 1 ? maxAngle / (total - 1) : 0;
  const startAngle = total > 1 ? -maxAngle / 2 : 0;

  return (
    <>
      <div className="hand">
        <div className="hand-cards">
          {cards.map((card, index) => {
            const angle = startAngle + index * angleStep;
            return (
              <div
                className="card"
                key={card.id}
                style={{
                  "--angle": `${angle}deg`,
                }}
                onClick={() => handleCardClick(card)}
              >
                {card.title}
              </div>
            );
          })}
        </div>
      </div>

      {selectedCard && (
        <div className="card-preview-overlay">
          <div className="card-preview" onClick={handlePlayCard}>
            <div className="card-large">{selectedCard.title}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hand;
