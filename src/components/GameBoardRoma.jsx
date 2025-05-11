import React, { useState } from "react";
import HandAI from "./HandAI";

const initialCards = [
  { id: "card-1", content: "card-1" },
  { id: "card-2", content: "card-2" },
  { id: "card-3", content: "card-3" },
  { id: "card-4", content: "card-4" },
];

const initialCardsAI = [
  { id: "card-1AI", content: "card-1", isAiCard: true },
  { id: "card-2AI", content: "card-2", isAiCard: true },
  { id: "card-3AI", content: "card-3", isAiCard: true },
  { id: "card-4AI", content: "card-4", isAiCard: true },
  { id: "card-5AI", content: "card-5", isAiCard: true },
];

export default function GameBoardRoma() {
  const [hand, setHand] = useState(initialCards);
  const [handAi, setHandAi] = useState(initialCardsAI);
  const [cards1, setCards1] = useState([]);
  const [cards2, setCards2] = useState([]);
  const [cards3, setCards3] = useState([]);
  const [cards4, setCards4] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleDropToRow = (rowSetter, rowId) => {
    if (!selectedCard) return;

    // Видаляємо карту з руки
    setHand((prev) => prev.filter((c) => c.id !== selectedCard.id));

    // Додаємо до вибраного ряду
    rowSetter((prev) => [...prev, selectedCard]);

    // Скидаємо виділення
    setSelectedCard(null);
  };

  const playAiMove = () => {
    if (handAi.length === 0) return;

    const movedCard = { ...handAi[0], isAiCard: true };
    const targetBlock = cards3.length <= cards4.length ? setCards3 : setCards4;

    setHandAi((prev) => prev.slice(1));
    targetBlock((prev) => [...prev, movedCard]);
  };

  return (
    <div className="game-container">
      <HandAI aiHand={handAi} />

      {/* 4 ряди для карт */}
      <div
        className="blocks-wrapper"
        style={{ position: "relative", top: "50px" }}
      >
        {/* Ряд ШІ 1 */}
        <div
          className="drop-area"
          style={{
            border: "2px dashed #888",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {cards3.map((card) => (
            <div className={`cardd ${card.id} ai-card`} key={card.id}>
              {card.content}
            </div>
          ))}
        </div>

        {/* Ряд ШІ 2 */}
        <div
          className="drop-area"
          style={{
            border: "2px dashed #888",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {cards4.map((card) => (
            <div className={`cardd ${card.id} ai-card`} key={card.id}>
              {card.content}
            </div>
          ))}
        </div>

        {/* Ряд гравця 1 */}
        <div
          className="drop-area"
          onClick={() => handleDropToRow(setCards1, "cards1")}
          style={{
            border: "2px dashed #888",
            display: "flex",
            justifyContent: "center",
            minHeight: "80px",
          }}
        >
          {cards1.map((card) => (
            <div className={`cardd ${card.id}`} key={card.id}>
              {card.content}
            </div>
          ))}
        </div>

        {/* Ряд гравця 2 */}
        <div
          className="drop-area"
          onClick={() => handleDropToRow(setCards2, "cards2")}
          style={{
            border: "2px dashed #888",
            display: "flex",
            justifyContent: "center",
            minHeight: "80px",
          }}
        >
          {cards2.map((card) => (
            <div className={`cardd ${card.id}`} key={card.id}>
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка AI */}
      <button onClick={playAiMove} className="make-move">
        Хід ШІ
      </button>

      {/* Рука гравця */}
      <div className="hand-zone">
        {hand.map((card) => (
          <div
            className={`cardd ${card.id}`}
            key={card.id}
            onClick={() => handleCardClick(card)}
            style={{
              cursor: "pointer",
              transform:
                selectedCard?.id === card.id ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            {card.content}
          </div>
        ))}
      </div>

      {/* Обрана карта (збільшена справа) */}
      {selectedCard && (
        <div
          className="selected-card-preview"
          style={{
            position: "absolute",
            top: "20%",
            right: "30px",
            border: "3px solid #555",
            padding: "12px",
            backgroundColor: "#fff",
            fontSize: "1.2em",
            zIndex: 1000,
            transition: "transform 0.3s ease",
          }}
        >
          {selectedCard.content}
        </div>
      )}
    </div>
  );
}
